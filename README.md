# @wangshijun/secp256k1

This module provides pure javascript implementation of secp256k1, [elliptic](https://github.com/indutny/elliptic) is used behind the scene

## Installation

`npm install @wangshijun/secp256k1`

## Usage

- [API Reference (v4.x)](API.md) (current version)

##### Private Key generation, Public Key creation, signature creation, signature verification

```js
const { randomBytes } = require('crypto');
const secp256k1 = require('@wangshijun/secp256k1');

// generate message to sign
// message should have 32-byte length, if you have some other length you can hash message
// for example `msg = sha256(rawMessage)`
const msg = randomBytes(32);

// generate privKey
let privKey;
do {
  privKey = randomBytes(32);
} while (!secp256k1.privateKeyVerify(privKey));

// get the public key in a compressed format
const pubKey = secp256k1.publicKeyCreate(privKey);

// sign the message
const sigObj = secp256k1.ecdsaSign(msg, privKey);

// verify the signature
console.log(secp256k1.ecdsaVerify(sigObj.signature, msg, pubKey));
// => true
```

\* **.verify return false for high signatures**

##### Get X point of ECDH

```js
const { randomBytes } = require('crypto');
const secp256k1 = require('@wangshijun/secp256k1');

// generate privKey
function getPrivateKey() {
  while (true) {
    const privKey = randomBytes(32);
    if (secp256k1.privateKeyVerify(privKey)) return privKey;
  }
}

// generate private and public keys
const privKey = getPrivateKey();
const pubKey = secp256k1.publicKeyCreate(getPrivateKey());

// compressed public key from X and Y
function hashfn(x, y) {
  const pubKey = new Uint8Array(33);
  pubKey[0] = (y[31] & 1) === 0 ? 0x02 : 0x03;
  pubKey.set(x, 1);
  return pubKey;
}

// get X point of ecdh
const ecdhPointX = secp256k1.ecdh(pubKey, privKey, { hashfn }, Buffer.alloc(33));
console.log(ecdhPointX.toString('hex'));
```

## LICENSE

This library is free and open-source software released under the MIT license.
