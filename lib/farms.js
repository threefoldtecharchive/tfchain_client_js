const { getTwin } = require('./twin')
const { hex2a } = require('./util')

// createFarm creates a farm with given properties
async function createFarm (farm, callback) {
  try {
    await validateFarm(farm)
  } catch (error) {
    // callback early with error
    if (callback) {
      return callback(error)
    }
    return error
  }

  farm = this.api.createType('Farm', farm)

  const create = this.api.tx.tfgridModule.createFarm(farm)
  const nonce = await this.api.rpc.system.accountNextIndex(this.address)

  return create.signAndSend(this.key, { nonce }, callback)
}

// getFarm gets a farm by id
async function getFarm (id) {
  try {
    id = parseInt(id)
  } catch (error) {
    throw Error('ID must be an integer')
  }
  if (isNaN(id) || id === 0) {
    throw Error('You must pass a valid ID')
  }

  const farm = await this.api.query.tfgridModule.farms(id)

  const res = farm.toJSON()
  if (res.id !== id) {
    throw Error('No such farm')
  }

  res.name = hex2a(res.name)
  return res
}

async function listFarms (self) {
  const farms = await this.api.query.tfgridModule.farms.entries()

  const parsedFarms = farms.map(farm => {
    const parsedFarm = farm[1].toJSON()
    parsedFarm.name = hex2a(parsedFarm.name)

    return parsedFarm
  })

  return parsedFarms
}

// deleteFarm deletes a farm by id
async function deleteFarm (id, callback) {
  const farm = await getFarm(id)
  if (parseInt(farm.id) !== parseInt(id)) {
    throw Error(`farm with id ${id} does not exist`)
  }
  const nonce = await this.api.rpc.system.accountNextIndex(this.address)

  return this.api.tx.tfgridModule
    .deleteFarm(id)
    .signAndSend(this.key, { nonce }, callback)
}

async function validateFarm (farm) {
  const { name, twin_id: twinID } = farm
  // const { pricingPolicyID, certificationType, countryID, cityID } = farm

  if (name === '') {
    throw Error('farm should have a name')
  }

  const twin = await getTwin(twinID)
  if (twin.id !== twinID) {
    throw Error(`twin with id ${twinID} does not exist`)
  }
}

module.exports = {
  createFarm,
  getFarm,
  deleteFarm,
  listFarms
}
