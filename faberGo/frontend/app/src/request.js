import axios from "axios";

const server = "http://localhost"
const port = 9000
const base = "/faber"

function backend() {
    return server + ":" + port + base
}

function header() {
    return {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    };
}

function get(path, params) {
    return new Promise(((resolve, reject) => {
        axios({
            headers: header(),
            method: "get",
            url: path,
            params: params,
        }).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    }));
}

function post(path, data) {
    const inside = new URLSearchParams();
    Object.keys(data).forEach((key) => {
        inside.append(key, data[key]);
    });
    return new Promise(((resolve, reject) => {
        axios({
            headers: header(),
            method: "post",
            url: path,
            data: inside,
        }).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    }));
}

// 完成区块链网络的创建和删除工作。

export function networkCreate(name) {
    return post(backend() + "/network/create", { name: name });
}

function networkList() {
    return get(backend() + "/network/list", {});
}

export function networkDelete(name) {
    return post(backend() + "/network/delete", { name: name });
}

function networkOpen(name) {
    return post(backend() + "/network/open", { name: name })
}

// 区块链网络上组织、节点、通道管理

export function blockchainCreate(name, key) {
    return post(backend() + "/blockchain/create", { name: name, key: key })
}

export function blockchainChannelCreate(name, blockchain) {
    return post(backend() + "/blockchain/channel/create", { name: name, blockchain: blockchain })
}

export function blockchainOrganizationCreate(name, blockchain) {
    return post(backend() + "/blockchain/org/create", { name: name, blockchain: blockchain })
}

export function blockchainOrganizationJoinChannel(org, channel) {
    return post(backend() + "/blockchain/org/join/channel", { org: org, channel: channel })
}

// name: The name of the node. This should be a unique identifier for the node within the blockchain network.
// org: The organization to which the node belongs. This should be the identifier of an existing organization within the network.
// blockchain: The identifier of the blockchain network where the node will be created.
// host: The hostname or IP address of the server where the node will be running.
// ssh: The SSH port number for accessing the server where the node is hosted.
// fabricPort: The port number used by the Fabric service on the node.
// user: The username for SSH access to the server.
// pwd: The password for SSH access to the server.
// key: A key for secure access or operation within the blockchain network.
// bootstrap: A semicolon-separated list of initial configuration or bootstrap data for the node.
// type: A semicolon-separated list of types or roles that the node will have in the blockchain network.
export function blockchainNodeCreate(name, org, blockchain, host, ssh, fabricPort, user, pwd, key, bootstrap, type) {
    return post(backend() + "/blockchain/node/create", {
        name, org, blockchain, host, ssh, fabricPort, user, pwd, key, bootstrap, type
    })
}

// 区块链配置文件保存、环境安装、区块链网络部署

export function configSave() {
    return post(backend() + "/environment/config/save", {})
}

function configFetch() {
    return post(backend() + "/environment/config/fetch", {})
}

export function configGenerate() {
    return post(backend() + "/environment/config/generate", {})
}

function install() {
    return post(backend() + "/environment/install", {})
}

function deploy() {
    return post(backend() + "/environment/deploy", {})
}
