'use strict';

const b64 = require('urlsafe-base64');
const sodium = require('sodium').api;

module.exports = function createEntity(){
  const { publicKey, secretKey } = sodium.crypto_sign_keypair();
  const encryptingPublicKey = sodium.crypto_sign_ed25519_pk_to_curve25519(publicKey);
  const encryptingSecretKey = sodium.crypto_sign_ed25519_sk_to_curve25519(secretKey);
  const registrationSecret = Buffer.alloc(32);
  sodium.randombytes(registrationSecret);
  return {
    signingPublicKey: b64.encode(publicKey),
    signingPrivateKey: b64.encode(secretKey),
    encryptingPublicKey: b64.encode(encryptingPublicKey),
    encryptingPrivateKey: b64.encode(encryptingSecretKey),
    registrationSecret: b64.encode(registrationSecret),
  };
};
