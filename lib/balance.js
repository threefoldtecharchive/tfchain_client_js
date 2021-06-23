async function getBalance (self, address) {
  const { data: balance } = await self.api.query.system.account(address)

  return {
    free: balance.free.toHuman(),
    reserved: balance.reserved.toHuman(),
    miscFrozen: balance.miscFrozen.toHuman(),
    feeFrozen: balance.feeFrozen.toHuman()
  }
}

module.exports = {
  getBalance
}
