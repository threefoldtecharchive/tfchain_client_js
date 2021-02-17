const { getFarm } = require('./farms')
const { getTwin } = require('./twin')
const { hex2a } = require('./util')

// createNode creates a node with given properties
async function createNode (self, node, callback) {
  try {
    await validateNode(self, node)
  } catch (error) {
    // callback early with error
    if (callback) {
      return callback(error)
    }
    return error
  }

  node = self.api.createType('Node', node)

  const create = self.api.tx.tfgridModule.createNode(node)
  const nonce = await self.api.rpc.system.accountNextIndex(self.address)

  return create.signAndSend(self.key, { nonce }, callback)
}

async function getNode (self, id) {
  try {
    id = parseInt(id)
  } catch (error) {
    throw Error('ID must be an integer')
  }
  if (isNaN(id) || id === 0) {
    throw Error('You must pass a valid ID')
  }

  const node = await self.api.query.tfgridModule.nodes(id)

  const res = node.toJSON()
  if (res.id !== id) {
    throw Error('No such node')
  }

  // Decode location
  const { location } = res
  const { longitude = '', latitude = '' } = location
  location.longitude = hex2a(longitude)
  location.latitude = hex2a(latitude)

  return res
}

async function listNodes (self) {
  const nodes = await self.api.query.tfgridModule.nodes.entries()

  const parsedNodes = nodes.map(node => {
    return node[1].toJSON()
  })

  return parsedNodes
}

// deleteNode deletes a node by id
async function deleteNode (self, id, callback) {
  const node = await getNode(self, id)
  if (parseInt(node.id) !== parseInt(id)) {
    throw Error(`node with id ${id} does not exist`)
  }
  const nonce = await self.api.rpc.system.accountNextIndex(self.address)

  return self.api.tx.tfgridModule
    .deleteNode(id)
    .signAndSend(self.key, { nonce }, callback)
}

async function validateNode (self, node) {
  const { farm_id: farmID, twin_id: twinID } = node

  const farm = await getFarm(self, farmID)
  if (farm.id !== farmID) {
    throw Error(`farm with id ${farmID} does not exist`)
  }

  const twin = await getTwin(self, twinID)
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
