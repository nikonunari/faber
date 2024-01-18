let id_dict = {};
let node_id = 0;
let BlockchainId;

const baseNode = {};

export function createNewNode(type) {
    let tp_id;
    if (!(type in id_dict)) {
        id_dict[type] = 1;
        tp_id = 0;
    }
    else {
        tp_id = id_dict[type];
        id_dict[type] += 1;
    }

    let thisNode = {
        ...baseNode, id: `${node_id++}`,
        data: {
            label: `${type}_${tp_id}`,
            name: ''
        },
        position: {
            x: Math.random() * 300,
            y: Math.random() * 300,
        },
    };

    switch (type) {
        case 'BlockchainNetwork':
            BlockchainId = thisNode.id;
            thisNode = {
                ...thisNode,
                type: 'group',
                className: 'BlockchainNetwork',
            };
            thisNode.data.name = 'Fabric Network';
            break;
        case 'Orderer':
            thisNode = {
                ...thisNode,
                className: 'Orderer',
                parentNode: BlockchainId,
                extent: 'parent',
            };
            thisNode.data.name = thisNode.data.label;
            break;
        case 'Peer':
            thisNode = {
                ...thisNode,
                className: 'Peer',
                parentNode: BlockchainId,
                extent: 'parent',
            };
            thisNode.data.name = thisNode.data.label;
            break;
        case 'Organization':
            thisNode = {
                ...thisNode,
                className: 'Organization',
                type: 'org',
                parentNode: BlockchainId,
                extent: 'parent',
                data: {
                    label: 'org' + tp_id,
                },
            };
            thisNode.data.name = thisNode.data.label;
            break;
        case 'Channel':
            thisNode = {
                ...thisNode,
                className: 'Channel',
                parentNode: BlockchainId,
                extent: 'parent',
            };
            thisNode.data.name = thisNode.data.label;
            break;
        default:
            break;
    }
    return thisNode;

}