// createContract creates a contract
async function createContract (self, twinID, nodeID, workload, numberOfPublicIPs, callback) {
  const contract = self.api.createType('Contract', {
    twin_id: twinID,
    node_id: self.api.createType('AccountId', nodeID),
    workload,
    public_ips: numberOfPublicIPs
  })

  const create = self.api.tx.smartContractModule.createContract(contract)
  const nonce = await self.api.rpc.system.accountNextIndex(self.address)

  return create.signAndSend(self.key, { nonce }, callback)
}

// createContract creates a contract
async function cancelContract (self, contractID, callback) {
  const cancel = self.api.tx.smartContractModule.cancelContract(contractID)
  const nonce = await self.api.rpc.system.accountNextIndex(self.address)

  return cancel.signAndSend(self.key, { nonce }, callback)
}

// getContract gets an contract by id
async function getContract (self, id) {
  try {
    id = parseInt(id)
  } catch (error) {
    throw Error('ID must be an integer')
  }
  if (isNaN(id) || id === 0) {
    throw Error('You must pass a valid ID')
  }

  const contract = await self.api.query.smartContractModule.contracts(id)

  const res = contract.toJSON()

  return res
}

module.exports = {
  createContract,
  cancelContract,
  getContract
}
