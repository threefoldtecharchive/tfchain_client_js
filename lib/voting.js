async function listBridgeValidators () {
  const validators = await this.api.query.tftBridgeModule.validators()

  return validators.toJSON()
}

async function proposeTransaction (transactionID, to, amount, callback) {
  amount = await this.api.createType('Balance', amount * 1e12)
  to = await this.api.createType('LookupSource', to)

  const create = this.api.tx.tftBridgeModule.proposeTransaction(transactionID, to, amount)
  const nonce = await this.api.rpc.system.accountNextIndex(this.address)

  return create.signAndSend(this.key, { nonce }, callback)
}

async function voteTransaction (transactionID, callback) {
  const create = this.api.tx.tftBridgeModule.voteTransaction(transactionID)
  const nonce = await this.api.rpc.system.accountNextIndex(this.address)

  return create.signAndSend(this.key, { nonce }, callback)
}

module.exports = {
  proposeTransaction,
  voteTransaction,
  listBridgeValidators
}
