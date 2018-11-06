'use strict';

const sodium = require('sodium').api;
const b64 = require('urlsafe-base64');

module.exports = function createRegistrantSecret(entity, serverPublicKey) {
  let nonce = Buffer.alloc(sodium.crypto_box_NONCEBYTES);
  sodium.randombytes(nonce);

  let cyphertext = sodium.crypto_box(
    Buffer.from(entity.registrationSecret),
    nonce,
    b64.decode(serverPublicKey),
    b64.decode(entity.encryptingPrivateKey)
  );

  return {cyphertext: b64.encode(cyphertext), nonce: b64.encode(nonce)};
};
