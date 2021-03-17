const { hex2a } = require('./util')

// createTwin creates an entity with given name
async function createTwin (ip, callback) {
  const create = this.api.tx.tfgridModule.createTwin(ip)
  const nonce = await this.api.rpc.system.accountNextIndex(this.address)

  return create.signAndSend(this.key, { nonce }, callback)
}

// addTwinEntity adds an entity to a twin object
// the signature is a signature provided by the entity that is added.
// the signature is composed of twinID-entityID as bytes signed by the entity's private key
// to proof that he in fact approved to be part of this twin
async function addTwinEntity (twinID, entityID, signature, callback) {
  const create = this.api.tx.tfgridModule.addTwinEntity(twinID, entityID, signature)
  const nonce = await this.api.rpc.system.accountNextIndex(this.address)

  return create.signAndSend(this.key, { nonce }, callback)
}

// deleteTwinEntity delets an entity from a twin
async function deleteTwinEntity (twinID, entityID, callback) {
  const remove = this.api.tx.tfgridModule.deleteTwinEntity(twinID, entityID)
  const nonce = await this.api.rpc.system.accountNextIndex(this.address)

  return remove.signAndSend(this.key, { nonce }, callback)
}

// getTwin gets a twin by id
async function getTwin (id) {
  try {
    id = parseInt(id)
  } catch (error) {
    throw Error('ID must be an integer')
  }
  if (isNaN(id) || id === 0) {
    throw Error('You must pass a valid ID')
  }

  const twin = await this.api.query.tfgridModule.twins(id)

  const res = twin.toJSON()
  res.ip = hex2a(res.ip)
  if (res.id !== id) {
    throw Error('No such twin')
  }
  return res
}

async function listTwins (self) {
  const twins = await this.api.query.tfgridModule.twins.entries()

  const parsedTwins = twins.map(twin => {
    const parsedTwin = twin[1].toJSON()
    parsedTwin.ip = hex2a(parsedTwin.ip)

    return parsedTwin
  })

  return parsedTwins
}

// deleteTwin deletes the twin linked to this signing key
async function deleteTwin (id, callback) {
  const twin = await getTwin(id)
  if (parseInt(twin.id) !== parseInt(id)) {
    throw Error(`twin with id ${id} does not exist`)
  }

  const nonce = await this.api.rpc.system.accountNextIndex(this.address)

  return this.api.tx.tfgridModule
    .deleteTwin(id)
    .signAndSend(this.key, { nonce }, callback)
}

module.exports = {
  createTwin,
  getTwin,
  deleteTwin,
  addTwinEntity,
  deleteTwinEntity,
  listTwins
}
