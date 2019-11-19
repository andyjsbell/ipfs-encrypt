const Web3 = require('web3');
const Util = require('ethereumjs-util');
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
const IPFS = require('ipfs');
const EthCrypto = require('eth-crypto');
const privateKey = 'A KEY GOES HERE';

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
    // Basic payload with JSON
    const payload = {msg:"this is a message"};
    const ethIdentity = await getPublicKeyForFirstAccount();
    // const alice = EthCrypto.createIdentity();
    let pubKey = ethIdentity.pubKey.substr(2);
    // pubKey = alice.publicKey;

    // console.log(alice.privateKey.length);
    console.log(privateKey.length);

    const encrypted = await EthCrypto.encryptWithPublicKey(
        pubKey,
        JSON.stringify(payload) // we have to stringify the payload before we can encrypt it
    );

    const encryptedString = EthCrypto.cipher.stringify(encrypted);
    // Create a file on the fly with our encrypted payload
    const filesAdded = await node.add({
        path: 'encrypted.json',
        content: Buffer.from(encryptedString)
    });

    console.log('Added file:', filesAdded[0].path, filesAdded[0].hash);

    const fileBuffer = await node.cat(filesAdded[0].hash);

    console.log('Added file contents:', fileBuffer.toString());

    const encryptedObject = EthCrypto.cipher.parse(fileBuffer.toString());

    const decrypted = await EthCrypto.decryptWithPrivateKey(
        privateKey,
        encryptedObject
    );

    const decryptedPayload = JSON.parse(decrypted);
    console.log(decryptedPayload);
}

main()