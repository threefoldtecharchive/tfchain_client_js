const { ApiPromise, WsProvider } = require('@polkadot/api')
const types = require('./types.json')
const { parseI16F16 } = require('@encointer/util')
const BN = require('bn.js')

async function main () {
  const provider = new WsProvider('wss://tfchain.test.grid.tf')
  const api = await ApiPromise.create({ provider, types })

  const price = await api.query.tftPriceModule.averageTftPrice()

  const priceAsUint16 = new DataView(price.buffer).getUint16(0, true)

  /// Got fixed-point encoded number
  const priceFixedPoint = new BN(priceAsUint16, 2)

  /// Parse to Number
  const result = parseI16F16(priceFixedPoint)

  console.log(result)
}

main()
