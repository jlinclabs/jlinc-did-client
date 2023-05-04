'use strict';

const sodium = require('sodium-native');
const b64 = require('urlsafe-base64');

module.exports = function verifySigningKeypair({signingPublicKey, signingPrivateKey}) {
  if (!signingPublicKey) throw new Error('signingPublicKey is required');
  if (!signingPrivateKey) throw new Error('signingPrivateKey is required');
  if (typeof signingPublicKey !== 'string') throw new Error('signingPublicKey must of type string');
  if (typeof signingPrivateKey !== 'string') throw new Error('signingPrivateKey must of type string');

  const itemToSign = Buffer.from(`${Math.random()} is my favorite number`, 'utf8');

  const signature = Buffer.alloc(itemToSign.length + sodium.crypto_sign_BYTES);
  sodium.crypto_sign(
    signature,
    itemToSign,
    b64.decode(signingPrivateKey),
  );

  // if (!signature) throw new Error('invalid keypair: failed to sign');

  const decodedItem = Buffer.alloc(signature.length - sodium.crypto_sign_BYTES);
  const decodeSuccess = sodium.crypto_sign_open(
    decodedItem,
    signature,
    b64.decode(signingPublicKey)
  );

  if (!decodeSuccess) throw new Error('invalid keypair: failed to decode signed item');

  return true;
};
