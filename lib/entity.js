const { hex2a } = require('./util')

// createEntity creates an entity with given name
async function createEntity (target, name, countryID, cityID, signature, callback) {
  const create = this.api.tx.tfgridModule.createEntity(target, name, countryID, cityID, signature)
  const nonce = await this.api.rpc.system.accountNextIndex(this.address)

  return create.signAndSend(this.key, { nonce }, callback)
}

// updateEntity updates the entity linked to this signing key
async function updateEntity (name, countryID, cityID, callback) {
  const update = this.api.tx.tfgridModule.updateEntity(name, countryID, cityID)
  const nonce = await this.api.rpc.system.accountNextIndex(this.address)

  return update.signAndSend(this.key, { nonce }, callback)
}

// getEntity gets an entity by id
async function getEntity (id) {
  try {
    id = parseInt(id)
  } catch (error) {
    throw Error('ID must be an integer')
  }
  if (isNaN(id) || id === 0) {
    throw Error('You must pass a valid ID')
  }

  const entity = await this.api.query.tfgridModule.entities(id)

  const res = entity.toJSON()
  if (res.id !== id) {
    throw Error('No such entity')
  }

  res.name = hex2a(res.name)
  return res
}

async function listEntities (self) {
  const entities = await this.api.query.tfgridModule.entities.entries()

  const parsedEntities = entities.map(entity => {
    const parsedEntity = entity[1].toJSON()
    parsedEntity.name = hex2a(parsedEntity.name)

    return parsedEntity
  })

  return parsedEntities
}

// deleteEntity deletes the entity linked to this signing key
async function deleteEntity (callback) {
  const nonce = await this.api.rpc.system.accountNextIndex(this.address)

  return this.api.tx.tfgridModule
    .deleteEntity()
    .signAndSend(this.key, { nonce }, callback)
}

module.exports = {
  createEntity,
  updateEntity,
  getEntity,
  deleteEntity,
  listEntities
}
