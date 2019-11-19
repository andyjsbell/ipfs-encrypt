Web3 = require('web3');
Util = require('ethereumjs-util');
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

// Public key from the first ethereum account
// Sign a message and then we can get back the public key back

async function getPublicKeyForFirstAccount() {
    let hashedMsg = web3.utils.sha3('test');
    let accounts = await web3.eth.getAccounts();
    let account = accounts[0];

    let signature = await web3.eth.sign(hashedMsg, account);
    let sig = Util.fromRpcSig(signature);

    let pubKeyBuffer = Util.ecrecover(Util.toBuffer(hashedMsg), sig.v, sig.r, sig.s);
    let pubKey = Util.bufferToHex(pubKeyBuffer);

    return {pubKey, account};
}
  
(async() => {
    console.log(await getPublicKeyForFirstAccount());
})();