Web3 = require('web3');
Util = require('ethereumjs-util');
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
IPFS = require('ipfs');

// Public key from the first ethereum account
// Sign a message and then we can get back the public key back
// Returns account and its public key
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
  
async function main() {
    // Create an IPFS node
    const node = await IPFS.create();
    
    // Create a file on the fly which has some basic JSON
    const filesAdded = await node.add({
        path: 'something.json',
        content: Buffer.from(JSON.stringify({msg:"this is a message"}))
    });

    console.log('Added file:', filesAdded[0].path, filesAdded[0].hash);

    const fileBuffer = await node.cat(filesAdded[0].hash);

    console.log('Added file contents:', fileBuffer.toString());
}

main()