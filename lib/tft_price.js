async function tftPrice(self) {
    const value = await self.api.query.tftPriceModule.tftPrice()

    return value.toHuman()
}
module.exports = {
    tftPrice
}
