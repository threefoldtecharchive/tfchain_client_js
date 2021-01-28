const { hex2a } = require('./util')

// createTwin creates an entity with given name
async function createTwin (self, peerID, callback) {
  const create = self.api.tx.tfgridModule.createTwin(peerID)
  return create.signAndSend(self.key, callback)
}

// addTwinEntity adds an entity to a twin object
// the signature is a signature provided by the entity that is added.
// the signature is composed of twinID-entityID as bytes signed by the entity's private key
// to proof that he in fact approved to be part of this twin
async function addTwinEntity (self, twinID, entityID, signature, callback) {
  const create = self.api.tx.tfgridModule.addTwinEntity(twinID, entityID, signature)
  return create.signAndSend(self.key, callback)
}

// deleteTwinEntity delets an entity from a twin
async function deleteTwinEntity (self, twinID, entityID, callback) {
  const remove = self.api.tx.tfgridModule.deleteTwinEntity(twinID, entityID)
  return remove.signAndSend(self.key, callback)
}

// getTwin gets a twin by id
async function getTwin (self, id) {
  if (isNaN(id)) {
    throw Error('You must pass an ID')
  }

  const twin = await self.api.query.tfgridModule.twins(id)

  const res = twin.toJSON()
  res.peer_id = hex2a(res.peer_id)
  return res
}

async function listTwins (self) {
  const entities = await self.api.query.tfgridModule.twins.entries()

  const parsedTwins = entities.map(twin => {
    const parsedTwin = twin[1].toJSON()
    parsedTwin.peer_id = hex2a(parsedTwin.peer_id)

    return parsedTwin
  })

  return parsedTwins
}

// deleteTwin deletes the twin linked to this signing key
async function deleteTwin (self, id, callback) {
  const twin = await getTwin(self, id)
  if (twin.id !== id) {
    throw Error(`twin with id ${id} does not exist`)
  }

  return self.api.tx.tfgridModule
    .deleteTwin(id)
    .signAndSend(self.key, callback)
}

module.exports = {
  createTwin,
  getTwin,
  deleteTwin,
  addTwinEntity,
  deleteTwinEntity,
  listTwins
}
