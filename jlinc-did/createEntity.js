'use strict';

const b64 = require('urlsafe-base64');
const sodium = require('sodium').api;

module.exports = function createEntity(){
  const { publicKey, secretKey } = sodium.crypto_sign_keypair();
  const cryptoKeypair = sodium.crypto_box_keypair();
  let registrationSecret = Buffer.alloc(32);
  sodium.randombytes(registrationSecret);
  return {
    signingPublicKey: b64.encode(publicKey),
    signingPrivateKey: b64.encode(secretKey),
    encryptingPublicKey: b64.encode(cryptoKeypair.publicKey),
    encryptingPrivateKey: b64.encode(cryptoKeypair.secretKey),
    registrationSecret: registrationSecret.toString('hex')
  };
};
