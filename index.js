Web3 = require('web3');
Util = require('ethereumjs-util');
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

async function getPublicKeyForFirstAccount() {
    let hashedMsg = web3.utils.sha3('test');
    let accounts = await web3.eth.getAccounts();
    
    let signature = await web3.eth.sign(hashedMsg, accounts[0]);
    let sig = Util.fromRpcSig(signature);

    let pubKeyBuffer = Util.ecrecover(Util.toBuffer(hashedMsg), sig.v, sig.r, sig.s);
    let pubKey = Util.bufferToHex(pubKeyBuffer);

    return pubKey;
}
  
(async() => {
    console.log("Public Key: ", await getPublicKeyForFirstAccount());
})();