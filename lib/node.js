const { getFarm } = require('./farms')
const { getTwin } = require('./twin')
const { hex2a } = require('./util')

// createNode creates a node with given properties
async function createNode (node, callback) {
  try {
    await validateNode(node)
  } catch (error) {
    // callback early with error
    if (callback) {
      return callback(error)
    }
    return error
  }

  node = this.api.createType('Node', node)

  const create = this.api.tx.tfgridModule.createNode(node)
  const nonce = await this.api.rpc.system.accountNextIndex(this.address)

  return create.signAndSend(this.key, { nonce }, callback)
}

async function getNode (id) {
  try {
    id = parseInt(id)
  } catch (error) {
    throw Error('ID must be an integer')
  }
  if (isNaN(id) || id === 0) {
    throw Error('You must pass a valid ID')
  }

  const node = await this.api.query.tfgridModule.nodes(id)

  const res = node.toJSON()
  if (res.id !== id) {
    throw Error('No such node')
  }

  // Decode location
  const { location } = res
  const { longitude = '', latitude = '' } = location
  location.longitude = hex2a(longitude)
  location.latitude = hex2a(latitude)
  res.pub_key = hex2a(res.pub_key)

  return res
}

async function listNodes (self) {
  const nodes = await this.api.query.tfgridModule.nodes.entries()

  const parsedNodes = nodes.map(node => {
    return node[1].toJSON()
  })

  return parsedNodes
}

// deleteNode deletes a node by id
async function deleteNode (id, callback) {
  const node = await getNode(id)
  if (parseInt(node.id) !== parseInt(id)) {
    throw Error(`node with id ${id} does not exist`)
  }
  const nonce = await this.api.rpc.system.accountNextIndex(this.address)

  return this.api.tx.tfgridModule
    .deleteNode(id)
    .signAndSend(this.key, { nonce }, callback)
}

async function validateNode (node) {
  const { farm_id: farmID, twin_id: twinID } = node

  const farm = await getFarm(farmID)
  if (farm.id !== farmID) {
    throw Error(`farm with id ${farmID} does not exist`)
  }

  const twin = await getTwin(twinID)
  if (twin.id !== twinID) {
    throw Error(`twin with id ${twinID} does not exist`)
  }
}

module.exports = {
  createNode,
  getNode,
  deleteNode,
  listNodes
}
