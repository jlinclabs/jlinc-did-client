'use strict';

const b64 = require('urlsafe-base64');
const sodium = require('sodium-native');

module.exports = function signHash(itemToSign, privateKey){
  const hash = Buffer.alloc(sodium.crypto_hash_sha256_BYTES);
  sodium.crypto_hash_sha256(hash, Buffer.from(itemToSign));
  const signature = Buffer.alloc(sodium.crypto_sign_BYTES);
  sodium.crypto_sign_detached(
    signature,
    hash,
    b64.decode(privateKey)
  );
  return b64.encode(signature);
};