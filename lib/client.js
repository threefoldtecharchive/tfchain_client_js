const { ApiPromise, WsProvider, Keyring } = require('@polkadot/api')
const types = require('../types.json')
const bip39 = require('bip39')

const { getEntity, deleteEntity, createEntity, updateEntity, listEntities } = require('./entity')
const { createTwin, getTwin, deleteTwin, addTwinEntity, deleteTwinEntity, listTwins } = require('./twin')
const { createFarm, getFarm, deleteFarm, listFarms } = require('./farms')
const { createNode, getNode, deleteNode, listNodes } = require('./node')
const { signEntityTwinID } = require('./sign')
const { getPrice } = require('./price')
const { vestedTransfer } = require('./vesting')
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

    // if no words provided, use the default alice key
    if (!this.words) {
      const keyring = new Keyring({ type: 'sr25519' })
      const key = keyring.addFromUri('//Alice', { name: 'Alice default' })
      this.key = key
      console.log(`Default account Alice with address: ${this.key.address} is loaded.`)
    } else {
      if (!bip39.validateMnemonic(this.words)) {
        throw Error('Invalid mnemonic! Must be bip39 compliant')
      }
      const key = keyring.addFromMnemonic(this.words)
      this.key = key
      console.log(`Key with address: ${this.key.address} is loaded.`)
    }

    this.keyring = keyring
    this.address = this.key.address

    this.api = api
  }

  async sign (entityID, twinID) {
    return signEntityTwinID(this, entityID, twinID)
  }

  async updateEntity (name, countryID, cityID, callback) {
    return updateEntity(this, name, countryID, cityID, callback)
  }

  async createEntity (name, countryID, cityID, callback) {
    return createEntity(this, name, countryID, cityID, callback)
  }

  async getEntityByID (id) {
    return getEntity(this, id)
  }

  async listEntities () {
    return listEntities(this)
  }

  async deleteEntity (callback) {
    return deleteEntity(this, callback)
  }

  async createTwin (ip, callback) {
    return createTwin(this, ip, callback)
  }

  async getTwinByID (id) {
    return getTwin(this, id)
  }

  async listTwins () {
    return listTwins(this)
  }

  async deleteTwin (id, callback) {
    return deleteTwin(this, id, callback)
  }

  async addTwinEntity (twinID, entityID, signature, callback) {
    return addTwinEntity(this, twinID, entityID, signature, callback)
  }

  async deleteTwinEntity (twinID, entityID, callback) {
    return deleteTwinEntity(this, twinID, entityID, callback)
  }

  async createFarm (farm, callback) {
    return createFarm(this, farm, callback)
  }

  async getFarmByID (id) {
    return getFarm(this, id)
  }

  async listFarms () {
    return listFarms(this)
  }

  async deleteFarmByID (id, callback) {
    return deleteFarm(this, id, callback)
  }

  async createNode (node, callback) {
    return createNode(this, node, callback)
  }

  async getNodeByID (id) {
    return getNode(this, id)
  }

  async listNodes () {
    return listNodes(this)
  }

  async deleteNode (id, callback) {
    return deleteNode(this, id, callback)
  }

  async getPrice () {
    return getPrice(this)
  }

  async vest (locked, perBlock, startingBlock, tftPrice, callback) {
    return vestedTransfer(this, locked, perBlock, startingBlock, tftPrice, callback)
  }

  async getBalance () {
    return getBalance(this)
  }

  async proposeTransaction (transactionID, to, amount, callback) {
    return proposeTransaction(this, transactionID, to, amount, callback)
  }

  async voteTransaction (transactionID, callback) {
    return voteTransaction(this, transactionID, callback)
  }

  async listValidators () {
    return listValidators(this)
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
