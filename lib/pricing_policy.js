async function getPricingPolicyById(self, policyId) {
    const value = await self.api.query.tfgridModule.pricingPolicies(policyId)

    return value.toHuman()
}
module.exports = {
    getPricingPolicyById
}
