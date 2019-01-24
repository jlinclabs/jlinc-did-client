'use strict';

const sodium = require('sodium').api;
const b64 = require('urlsafe-base64');

module.exports = function verifySigningKeypair({signingPublicKey, signingPrivateKey}) {
  if (!signingPublicKey) throw new Error('signingPublicKey is required');
  if (!signingPrivateKey) throw new Error('signingPrivateKey is required');
  if (typeof signingPublicKey !== 'string') throw new Error('signingPublicKey must of type string');
  if (typeof signingPrivateKey !== 'string') throw new Error('signingPrivateKey must of type string');

  const itemToSign = `${Math.random()} is my favorite number`;

  const signedItem = sodium.crypto_sign(
    Buffer.from(itemToSign, 'utf8'),
    b64.decode(signingPrivateKey),
  );

  if (!signedItem) throw new Error('invalid keypair: failed to sign');

  const decodedItem = sodium.crypto_sign_open(
    signedItem,
    b64.decode(signingPublicKey)
  );

  if (!decodedItem) throw new Error('invalid keypair: failed to decode signed item');

  return true;
};
