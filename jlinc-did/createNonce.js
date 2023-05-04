'use strict';

const sodium = require('sodium-native');

module.exports = function createNonce() {
  const nonce = Buffer.alloc(32);
  sodium.randombytes_buf(nonce);
  return nonce.toString('hex');
};
