// createTwin creates an entity with given name
async function getPrice (self) {
  const price = await self.api.query.tftPriceModule.tFTPrice()

  const res = price
  return res
}

module.exports = {
  getPrice
}
