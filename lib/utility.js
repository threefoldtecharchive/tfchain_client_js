async function batch (self, extrinsics, callback) {
  const batch = self.api.tx.utility.batch(extrinsics)
  const nonce = await self.api.rpc.system.accountNextIndex(self.address)

  return batch.signAndSend(self.key, { nonce }, callback)
}

module.exports = {
  batch
}