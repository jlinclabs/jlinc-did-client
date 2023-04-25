'use strict';

const b64 = require('urlsafe-base64');
const sodium = require('sodium-native');

module.exports = function createKeys(){
  const signingPublicKey = Buffer.alloc(sodium.crypto_sign_PUBLICKEYBYTES);
  const signingPrivateKey = Buffer.alloc(sodium.crypto_sign_SECRETKEYBYTES);
  sodium.crypto_sign_keypair(signingPublicKey, signingPrivateKey);
  const encryptingPublicKey = Buffer.alloc(sodium.crypto_box_PUBLICKEYBYTES);
  const encryptingPrivateKey = Buffer.alloc(sodium.crypto_box_SECRETKEYBYTES);
  sodium.crypto_box_keypair(encryptingPublicKey, encryptingPrivateKey);
  return {
    signingPublicKey: b64.encode(signingPublicKey),
    signingPrivateKey: b64.encode(signingPrivateKey),
    encryptingPublicKey: b64.encode(encryptingPublicKey),
    encryptingPrivateKey: b64.encode(encryptingPrivateKey),
  };
};
