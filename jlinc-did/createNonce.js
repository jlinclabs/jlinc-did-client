'use strict';

const sodium = require('sodium').api;

module.exports = function createNonce() {
  const nonce = Buffer.alloc(32);
  sodium.randombytes(nonce);
  return nonce.toString('hex');
};
