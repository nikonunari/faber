import React, { useState, useCallback, useRef, useImperativeHandle, forwardRef } from 'react';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ReactFlow, {
  Controls, Background,
  applyEdgeChanges, applyNodeChanges,
  addEdge,
  MiniMap,
} from 'reactflow';
import { ReactFlowProvider } from 'react-flow-renderer';
import 'reactflow/dist/style.css';

// my own components
import OrgNode from './TextUpdaterNode.js';
// import { initialNodes, initialEdges } from './test_nodes.js';
import { createNewNode } from './nodeManage.js'
import {
  networkCreate, blockchainCreate, blockchainChannelCreate, blockchainOrganizationCreate, blockchainNodeCreate,
  blockchainOrganizationJoinChannel,
  configSave,
  networkDelete
} from './request.js';
import './App.css';

// networkCreate('test');

const ItemType = {
  COMPONENT: 'component',
};

// define the nodeTypes outside of the component to prevent re-renderings
const nodeTypes = { org: OrgNode }

const ToolbarItem = ({ type, children }) => {
  const [, drag] = useDrag({
    type: ItemType.COMPONENT,
    item: { type },
  });
  return (
    <div ref={drag} className="toolbarItem">
      {children}
    </div>
  );
};

const edgeOptions = {
  animated: true,
  className: 'Edge',
  style: {
    stroke: 'green',
    strokeWidth: 3,
    // strokeDasharray: 0,
  },
};
const connectionLineStyle = { stroke: 'red' };
const Canvas = forwardRef((props, ref) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

  // actions when add new connections
  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge(params, eds));

    setNodes((nds) => {
      return nds.map((node) => {
        if ((node.className === 'Organization' || node.className === 'Peer' || node.className === 'Orderer')
        && (node.id === params.source || node.id === params.target)) {
          // 找到另一个节点
          const otherNodeId = node.id === params.source ? params.target : params.source;
          const otherNode = nds.find((n) => n.id === otherNodeId);
    
          // 确保另一个节点存在并且有className和name属性
          if (otherNode && otherNode.className && otherNode.data && otherNode.data.name) {
            // 构建新的键值对
            const newProperty = {[otherNode.className]: otherNode.data.name};
            // 更新当前节点的property字典
            const updatedData = {
              ...node.data,
              property: {...(node.data.property || {}), ...newProperty},
            };
            // 返回更新后的节点
            // console.log({...node, data: updatedData});
            return { ...node, data: updatedData };
          }
        }
        return node;
      });
    });
    
  },
    [],
  );

  //* Drop component part
  const handleDrop = useCallback((item, monitor) => {
    // const dropPosition = monitor.getClientOffset();
    const newNode = createNewNode(item.type);
    setNodes((prevNodes) => [...prevNodes, newNode]);

  }, []);

  const [, drop] = useDrop({
    accept: ItemType.COMPONENT,
    drop: handleDrop,
  });

  const handleSave = useCallback(() => {
    //* send request to backend
    // TODO: adapt to different component
    // 1. create network, channel, org
    const blockchainNode = nodes.find((n) => n.className === 'BlockchainNetwork');
    const blockchainNodeName = blockchainNode.data.name;
    networkCreate(blockchainNodeName);
    blockchainCreate(blockchainNodeName, blockchainNodeName);

    nodes.forEach((item) => {
      const name = item.data.name;
      switch (item.className) {
        case 'Channel':
          // console.log(item);
          blockchainChannelCreate(name, blockchainNodeName);
          break;
        case 'Organization':
          blockchainOrganizationCreate(name, blockchainNodeName)
          break;
        default:
          break;
      }
    });
    // 2. organization join channel
    const blockchainNodes = nodes.filter((n) => n.className === 'Organization');
    blockchainNodes.forEach((node) => {
      // console.log(node);
      blockchainOrganizationJoinChannel(node.data.name, node.data.property.Channel)
    });

    // 3. create node
    const otherNodes = nodes.filter((n) => n.className === 'Peer' || n.className === 'Orderer');
    otherNodes.forEach((node) => {
      blockchainNodeCreate(node.data.name, node.data.property.Organization, blockchainNodeName, '127.0.0.1',
      36,12345, '', '', '','127.0.0.1:7051', 'leader_peer;anchor_peer;committing_peer;endorsing_peer');
    });
    // 4. save config
      configSave();
    })

  //* functions for canvas
  useImperativeHandle(ref, () => ({
    clearCanvas: () => { setNodes([]); setEdges([]); networkDelete('Fabric Network'); },
    savecfg: () => { handleSave(); }
  }));


  return (
    <div ref={drop} className="canvas" >
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          onNodesChange={onNodesChange}
          edges={edges}
          onEdgesChange={onEdgesChange}
          defaultEdgeOptions={edgeOptions}
          onConnect={onConnect}
          connectionLineStyle={connectionLineStyle}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap pannable zoomable />
        </ReactFlow>
      </ReactFlowProvider>
    </div>

  );
});

const App = () => {
  const canvasRef = useRef(null);

  const handleClearCanvas = () => {
    if (canvasRef.current) {
      canvasRef.current.clearCanvas();
    }
  };

  const handleSave = () => {
    if (canvasRef.current) {
      canvasRef.current.savecfg();
    }
  }

  const handleFilePreview = () => {
    //TODO: open config.json and visualize it
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app">
        <div className="navbar">
        <h1><pre>Fabric Draw      </pre></h1>
          <div className="actions">
          <button onClick={handleSave}>Download File</button>
            <button onClick={handleClearCanvas} id="clearButton">Clear</button>
            {/* <button onClick={handleFilePreview}>Download File</button> */}
          </div>
        </div>
        <div className="toolbar">
          <ToolbarItem type="Channel">Channel</ToolbarItem>
          <ToolbarItem type="CA">CA</ToolbarItem>
          <ToolbarItem type="Orderer">Orderer</ToolbarItem>
          <ToolbarItem type="Peer">Peer</ToolbarItem>
          <ToolbarItem type="Organization">Org</ToolbarItem>
          <ToolbarItem className="buttonBlockChain" type="BlockchainNetwork">FabricDraw</ToolbarItem>

        </div>
        <Canvas ref={canvasRef} />
      </div>
    </DndProvider>
  );
};

export default App;
