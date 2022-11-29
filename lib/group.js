const { validateID } = require('./util')

async function createGroup(self, callback) {
    const create = self.api.tx.smartContractModule.createGroup()
    const nonce = await self.api.rpc.system.accountNextIndex(self.address)

    return create.signAndSend(self.key, { nonce }, callback)
}

async function getGroup(self, id) {
    validateID(id)

    const group = await self.api.query.smartContractModule.Groups(id)
    const res = group.toJSON()
    return res
}

async function deleteGroup(self, groupId, callback) {
    const cancel = self.api.tx.smartContractModule.deleteGroup(groupId)
    const nonce = await self.api.rpc.system.accountNextIndex(self.address)

    return cancel.signAndSend(self.key, { nonce }, callback)
}

module.exports = {
    createGroup,
    getGroup,
    deleteGroup
}
