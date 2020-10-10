'use strict';

const base58BitcoinAlphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const base58 = require('base-x')(base58BitcoinAlphabet);
const b64 = require('urlsafe-base64');

module.exports = {
  b58encode: (bufferToEncode) => {
    return base58.encode(bufferToEncode);
  },
  b58decode: (strToDecode) => {
    return base58.decode(strToDecode);
  },
  b64tob58: (b64str) => {
    return base58.encode(b64.decode(b64str));
  },
  b58tob64: (b58str) => {
    return b64.encode(base58.decode(b58str));
  }
};
