async function getBalance () {
  const { data: balance } = await this.api.query.system.account(this.address)

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
