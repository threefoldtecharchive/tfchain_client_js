const { getFarm } = require('./farms')
const { getTwin } = require('./twin')

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
  if (isNaN(id)) {
    throw Error('You must pass an ID')
  }

  const node = await self.api.query.tfgridModule.nodes(id)

  return node.toJSON()
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
  if (isNaN(id)) {
    throw Error('You must pass an ID')
  }

  const node = await getNode(self, id)
  if (node.id !== id) {
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
