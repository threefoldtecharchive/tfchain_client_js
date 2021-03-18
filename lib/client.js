const { ApiPromise, WsProvider, Keyring } = require('@polkadot/api')
const crypto = require('@polkadot/util-crypto')
const types = require('../types.json')
const bip39 = require('bip39')

const { getEntity, deleteEntity, createEntity, updateEntity, listEntities } = require('./entity')
const { createTwin, getTwin, deleteTwin, addTwinEntity, deleteTwinEntity, listTwins } = require('./twin')
const { createFarm, getFarm, deleteFarm, listFarms } = require('./farms')
const { createNode, getNode, deleteNode, listNodes } = require('./node')
const { signEntityTwinID, signEntityCreation } = require('./sign')
const { getPrice, getAvgPrice } = require('./price')
const { vestedTransfer, addTransactionSignature, getTransaction, removeTransaction, reportFailedTransaction } = require('./vesting')
const { getBalance } = require('./balance')
const { proposeTransaction, voteTransaction, listValidators } = require('./voting')

class Client {
  constructor (url, words) {
    this.url = url
    this.words = words
    this.key = undefined
    this.address = undefined
  }

  async init () {
    const api = await getPolkaAPI(this.url)
    const keyring = new Keyring({ type: 'ed25519' })

    if (!this.words) {
      this.words = crypto.mnemonicGenerate()
    } else {
      if (!bip39.validateMnemonic(this.words)) {
        throw Error('Invalid mnemonic! Must be bip39 compliant')
      }
    }

    const key = keyring.addFromMnemonic(this.words)
    this.key = key

    this.keyring = keyring
    this.address = this.key.address

    this.api = api
  }

  async sign (entityID, twinID) {
    return signEntityTwinID.bind(this)(entityID, twinID)
  }

  async signEntityCreation (name, countryID, cityID) {
    return signEntityCreation.bind(this)(name, countryID, cityID)
  }

  async updateEntity (name, countryID, cityID, callback) {
    return updateEntity.bind(this)(name, countryID, cityID, callback)
  }

  async createEntity (target, name, countryID, cityID, signature, callback) {
    return createEntity.bind(this)(target, name, countryID, cityID, signature, callback)
  }

  async getEntityByID (id) {
    return getEntity.bind(this)(id)
  }

  async listEntities () {
    return listEntities.bind(this)(this)
  }

  async deleteEntity (callback) {
    return deleteEntity.bind(this)(callback)
  }

  async createTwin (ip, callback) {
    return createTwin.bind(this)(ip, callback)
  }

  async getTwinByID (id) {
    return getTwin.bind(this)(id)
  }

  async listTwins () {
    return listTwins.bind(this)(this)
  }

  async deleteTwin (id, callback) {
    return deleteTwin.bind(this)(id, callback)
  }

  async addTwinEntity (twinID, entityID, signature, callback) {
    return addTwinEntity.bind(this)(twinID, entityID, signature, callback)
  }

  async deleteTwinEntity (twinID, entityID, callback) {
    return deleteTwinEntity.bind(this)(twinID, entityID, callback)
  }

  async createFarm (farm, callback) {
    return createFarm.bind(this)(farm, callback)
  }

  async getFarmByID (id) {
    return getFarm.bind(this)(id)
  }

  async listFarms () {
    return listFarms.bind(this)(this)
  }

  async deleteFarmByID (id, callback) {
    return deleteFarm.bind(this)(id, callback)
  }

  async createNode (node, callback) {
    return createNode.bind(this)(node, callback)
  }

  async getNodeByID (id) {
    return getNode.bind(this)(id)
  }

  async listNodes () {
    return listNodes.bind(this)(this)
  }

  async deleteNode (id, callback) {
    return deleteNode.bind(this)(id, callback)
  }

  async getPrice () {
    return getPrice.bind(this)()
  }

  async getAveragePrice () {
    return getAvgPrice.bind(this)()
  }

  async vest (locked, perBlock, startingBlock, tftPrice, callback) {
    return vestedTransfer.bind(this)(locked, perBlock, startingBlock, tftPrice, callback)
  }

  async getBalance () {
    return getBalance.bind(this)(this)
  }

  async proposeTransaction (transactionID, to, amount, callback) {
    return proposeTransaction.bind(this)(transactionID, to, amount, callback)
  }

  async voteTransaction (transactionID, callback) {
    return voteTransaction.bind(this)(transactionID, callback)
  }

  async listValidators () {
    return listValidators.bind(this)(this)
  }

  async addTransactionSignature (transaction, signature, callback) {
    return addTransactionSignature.bind(this)(transaction, signature, callback)
  }

  async getTransaction (transaction) {
    return getTransaction.bind(this)(transaction)
  }

  async removeTransaction (transaction) {
    return removeTransaction.bind(this)(transaction)
  }

  async reportFailedTransaction (transaction) {
    return reportFailedTransaction.bind(this)(transaction)
  }
}

async function getPolkaAPI (url) {
  if (!url || url === '') {
    url = 'ws://localhost:9944'
  }

  const provider = new WsProvider(url)
  return ApiPromise.create({ provider, types })
}

module.exports = { Client }
