async function acceptTermsAndConditions(self){
    return await self.api.tx.tfgridModule.userAcceptTc("", "").signAndSend(self.key)
}

module.exports = {
    acceptTermsAndConditions
}