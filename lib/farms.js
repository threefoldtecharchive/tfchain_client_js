const { getTwin } = require('./twin')
const { hex2a } = require('./util')

// createFarm creates a farm with given properties
async function createFarm (self, farm, callback) {
  try {
    await validateFarm(self, farm)
  } catch (error) {
    // callback early with error
    if (callback) {
      return callback(error)
    }
    return error
  }

  farm = self.api.createType('Farm', farm)

  const create = self.api.tx.tfgridModule.createFarm(farm)
  const nonce = await self.api.rpc.system.accountNextIndex(self.address)

  return create.signAndSend(self.key, { nonce }, callback)
}

// getFarm gets a farm by id
async function getFarm (self, id) {
  try {
    id = parseInt(id)
  } catch (error) {
    throw Error('ID must be an integer')
  }
  if (isNaN(id) || id === 0) {
    throw Error('You must pass a valid ID')
  }

  const farm = await self.api.query.tfgridModule.farms(id)

  const res = farm.toJSON()
  if (res.id !== id) {
    throw Error('No such farm')
  }

  res.name = hex2a(res.name)
  return res
}

async function listFarms (self) {
  const farms = await self.api.query.tfgridModule.farms.entries()

  const parsedFarms = farms.map(farm => {
    const parsedFarm = farm[1].toJSON()
    parsedFarm.name = hex2a(parsedFarm.name)

    return parsedFarm
  })

  return parsedFarms
}

// deleteFarm deletes a farm by id
async function deleteFarm (self, id, callback) {
  const farm = await getFarm(self, id)
  if (parseInt(farm.id) !== parseInt(id)) {
    throw Error(`farm with id ${id} does not exist`)
  }
  const nonce = await self.api.rpc.system.accountNextIndex(self.address)

  return self.api.tx.tfgridModule
    .deleteFarm(id)
    .signAndSend(self.key, { nonce }, callback)
}

async function validateFarm (self, farm) {
  const { name, twin_id: twinID } = farm
  // const { pricingPolicyID, certificationType, countryID, cityID } = farm

  if (name === '') {
    throw Error('farm should have a name')
  }

  const twin = await getTwin(self, twinID)
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
