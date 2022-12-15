const { validateID } = require('./util')

// createContract creates a contract
async function createDeployment (self, capacityReservationContractId, hash, data, resources, numberOfPublicIps, callback) {
  const create = self.api.tx.smartContractModule.deploymentCreate(capacityReservationContractId, hash, data, resources, numberOfPublicIps)
  const nonce = await self.api.rpc.system.accountNextIndex(self.address)

  return create.signAndSend(self.key, { nonce }, callback)
}

async function updateDeployment (self, contractId, hash, data, resources, callback) {
  const update = self.api.tx.smartContractModule.deploymentUpdate(contractId, hash, data, resources)
  const nonce = await self.api.rpc.system.accountNextIndex(self.address)

  return update.signAndSend(self.key, { nonce }, callback)
}

async function getDeployment (self, id) {
  validateID(id)
  const deployment = await self.api.query.smartContractModule.deployments(id)
  const res = deployment.toJSON()
  return res
}

async function cancelDeployment (self, deploymentId, callback) {
  const cancel = self.api.tx.smartContractModule.deploymentCancel(deploymentId)
  const nonce = await self.api.rpc.system.accountNextIndex(self.address)

  return cancel.signAndSend(self.key, { nonce }, callback)
}

async function createNameContract (self, name, callback) {
  const create = self.api.tx.smartContractModule.createNameContract(name)
  const nonce = await self.api.rpc.system.accountNextIndex(self.address)

  return create.signAndSend(self.key, { nonce }, callback)
}

async function createCapacityReservationContract (self, farmId, capacityReservationPolicy, solutionProviderId, callback) {
  const create = self.api.tx.smartContractModule.capacityReservationContractCreate(farmId, capacityReservationPolicy, solutionProviderId)
  const nonce = await self.api.rpc.system.accountNextIndex(self.address)

  return create.signAndSend(self.key, { nonce }, callback)
}

async function updateCapacityReservationContract (self, capacityId, resources, callback) {
  const update = self.api.tx.smartContractModule.capacityReservationContractUpdate(capacityId, resources)
  const nonce = await self.api.rpc.system.accountNextIndex(self.address)

  return update.signAndSend(self.key, { nonce }, callback)
}


// cancelContract deletes a contract
async function cancelContract (self, contractID, callback) {
  const cancel = self.api.tx.smartContractModule.cancelContract(contractID)
  const nonce = await self.api.rpc.system.accountNextIndex(self.address)

  return cancel.signAndSend(self.key, { nonce }, callback)
}



// getContract gets an contract by id
async function getContract (self, id) {
  validateID(id)

  const contract = await self.api.query.smartContractModule.contracts(id)

  const res = contract.toJSON()

  return res
}

async function activeNodeContracts (self, id) {
  validateID(id)

  const contract = await self.api.query.smartContractModule.activeNodeContracts(id)

  const res = contract.toJSON()

  return res
}

async function contractIDByNameRegistration (self, name) {
  const contractID = await self.api.query.smartContractModule.contractIDByNameRegistration(name)

  const c = contractID.toJSON()

  return c
}

async function contractIDByNodeIDAndHash (self, nodeID, hash) {
  validateID(nodeID)

  const contractID = await self.api.query.smartContractModule.contractIDByNodeIDAndHash(nodeID, hash)

  const c = contractID.toJSON()

  return c
}

module.exports = {
  createDeployment,
  updateDeployment,
  getDeployment,
  cancelDeployment,
  createNameContract,
  createCapacityReservationContract,
  updateCapacityReservationContract,
  cancelContract,
  getContract,
  contractIDByNameRegistration,
  contractIDByNodeIDAndHash,
  activeNodeContracts,
}
