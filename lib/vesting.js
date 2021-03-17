const BN = require('bn.js')
const { toI16F16 } = require('@encointer/util')

async function vestedTransfer (locked, perBlock, startingBlock, tftPrice, callback) {
  // parse price to bytes
  tftPrice = toI16F16(tftPrice)

  // convert to price to a little endian byte array of size 4
  const uint8ArrayPrice = Uint8Array.from(tftPrice.toArrayLike(Buffer, 'le', 4))

  locked = new BN(locked)
  locked = await this.api.createType('Balance', locked.mul(new BN(1e12)))

  perBlock = await this.api.createType('Balance', perBlock * 1e12)

  const schedule = {
    locked,
    per_block: perBlock,
    starting_block: startingBlock,
    tft_price: uint8ArrayPrice
  }
  const target = await this.api.createType('LookupSource', this.address)

  const create = await this.api.tx.vesting.vestedTransfer(target, schedule)
  const nonce = await this.api.rpc.system.accountNextIndex(this.address)

  return await create.signAndSend(this.key, { nonce }, callback)
}

async function addTransactionSignature (transaction, signature, callback) {
  const create = this.api.tx.vestingValidatorModule.addSigTransaction(transaction, signature)
  const nonce = await this.api.rpc.system.accountNextIndex(this.address)

  return create.signAndSend(this.key, { nonce }, callback)
}

async function removeTransaction (transaction) {
  const create = this.api.tx.vestingValidatorModule.removeTransaction(transaction)
  const nonce = await this.api.rpc.system.accountNextIndex(this.address)

  return create.signAndSend(this.key, { nonce })
}

async function getTransaction (transaction) {
  const tx = await this.api.query.vestingValidatorModule.transactions(transaction)

  return tx.toJSON()
}

module.exports = {
  vestedTransfer,
  addTransactionSignature,
  getTransaction,
  removeTransaction
}
