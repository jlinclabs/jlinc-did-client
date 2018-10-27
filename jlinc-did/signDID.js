'use strict';

const b64 = require('urlsafe-base64');
const sodium = require('sodium').api;

module.exports = function signDID(did, entity){
  let stringToSign = `${did.id}.${did.created}`;
  let hash = sodium.crypto_hash_sha256(Buffer.from(stringToSign));
  let signature = sodium.crypto_sign_detached(hash, b64.decode(entity.signingPrivateKey));

  return b64.encode(signature);
};
