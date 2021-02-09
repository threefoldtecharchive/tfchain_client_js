async function proposeTransaction (self, transactionID, to, amount, callback) {
  amount = await self.api.createType('Balance', amount * 1e12)
  to = await self.api.createType('LookupSource', to)

  const create = self.api.tx.tftBridgeModule.proposeTransaction(transactionID, to, amount)
  return create.signAndSend(self.key, callback)
}

async function voteTransaction (self, transactionID, callback) {
  const create = self.api.tx.tftBridgeModule.voteTransaction(transactionID)
  return create.signAndSend(self.key, callback)
}

module.exports = {
  proposeTransaction,
  voteTransaction
}
