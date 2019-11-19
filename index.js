Web3 = require('web3');
Util = require('ethereumjs-util');
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

let hashedMsg = web3.utils.sha3('test');

web3.eth.getAccounts().then(accounts => {
    
    console.log("account:", accounts[0]);

    web3.eth.sign(hashedMsg, accounts[0]).then(signature => {
        
        let sig = Util.fromRpcSig(signature);
    
        let pubKeyBuffer = Util.ecrecover(Util.toBuffer(hashedMsg), sig.v, sig.r, sig.s);
        let pubKey = Util.bufferToHex(pubKeyBuffer);
        
        console.log("pubKey:", pubKey);
    });
});

