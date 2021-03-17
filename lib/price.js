const { parseI16F16 } = require('@encointer/util')
const BN = require('bn.js')

async function getPrice () {
  const price = await this.api.query.tftPriceModule.tftPrice()

  const priceAsUint16 = new DataView(price.buffer).getUint16(0, true)

  /// Got fixed-point encoded number
  const priceFixedPoint = new BN(priceAsUint16, 2)

  /// Parse to Number
  const result = parseI16F16(priceFixedPoint)

  return result
}

async function getAvgPrice () {
  const price = await this.api.query.tftPriceModule.averageTftPrice()

  const priceAsUint16 = new DataView(price.buffer).getUint16(0, true)

  /// Got fixed-point encoded number
  const priceFixedPoint = new BN(priceAsUint16, 2)

  /// Parse to Number
  const result = parseI16F16(priceFixedPoint)

  return result
}

module.exports = {
  getPrice,
  getAvgPrice
}
