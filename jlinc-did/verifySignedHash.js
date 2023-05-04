'use strict';

const b64 = require('urlsafe-base64');
const sodium = require('sodium-native');

module.exports = function verifySignedHash(signature, itemToSign, publicKey){
  const hash = Buffer.alloc(sodium.crypto_hash_sha256_BYTES);
  sodium.crypto_hash_sha256(hash, Buffer.from(itemToSign));
  return sodium.crypto_sign_verify_detached(
    b64.decode(signature),
    hash,
    b64.decode(publicKey)
  );
};