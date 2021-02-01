async function getBalance (self) {
  const { data: balance } = await self.api.query.system.account(self.address)

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
