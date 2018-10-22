'use strict';

const sodium = require('sodium').api;
const b64 = require('urlsafe-base64');

module.exports = function registerRequest() {
  return createEntity;
};

function createEntity(){
  const { publicKey, secretKey } = sodium.crypto_sign_keypair();
  const encryptingPublicKey = sodium.crypto_sign_ed25519_pk_to_curve25519(publicKey);
  const encryptingSecretKey = sodium.crypto_sign_ed25519_sk_to_curve25519(secretKey);
  const secret = Buffer.alloc(sodium.crypto_secretbox_NONCEBYTES);
  sodium.randombytes(secret);
  return {
    signingPublicKey: b64.encode(publicKey),
    signingPrivateKey: b64.encode(secretKey),
    encryptingPublicKey: b64.encode(encryptingPublicKey),
    encryptingPrivateKey: b64.encode(encryptingSecretKey),
    secret: b64.encode(secret),
  };
}
