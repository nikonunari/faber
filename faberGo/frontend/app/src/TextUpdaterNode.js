import { useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import { useUpdateNodeInternals} from 'react-flow-renderer';


function OrgNode({ id, data, isConnectable }) {
  const updateNodeInternals = useUpdateNodeInternals();

  const onChange = useCallback((evt) => {
    // 更新节点数据
    data.name = evt.target.value;
    // 通知 React Flow 更新节点
    updateNodeInternals(id);
    // console.log(data);
  },[data, id, updateNodeInternals]);

  return (
    <div>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <div>
        <label htmlFor="text">Organization:</label>
        <input id="text" name="text" onChange={onChange} className="nodrag" />
      </div>
      <Handle type="source" position={Position.Bottom} id="b" isConnectable={isConnectable} />
    </div>
  );
}

export default OrgNode;
