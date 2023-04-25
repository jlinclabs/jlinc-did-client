'use strict';

const sodium = require('sodium-native');
const b64 = require('urlsafe-base64');

module.exports = function verifyEncryptingKeypair({ encryptingPublicKey, encryptingPrivateKey }) {
  if (!encryptingPublicKey) throw new Error('encryptingPublicKey is required');
  if (!encryptingPrivateKey) throw new Error('encryptingPrivateKey is required');
  if (typeof encryptingPublicKey !== 'string') throw new Error('encryptingPublicKey must of type string');
  if (typeof encryptingPrivateKey !== 'string') throw new Error('encryptingPrivateKey must of type string');

  const secret = Buffer.allocUnsafe(sodium.crypto_box_SECRETKEYBYTES);
  sodium.randombytes_buf(secret);

  const itemToEncrypt = Buffer.from(`Drop and give me ${Math.floor(Math.random() * 10000)}`, 'utf-8');

  const encryptedItem = Buffer.alloc(itemToEncrypt.length + sodium.crypto_box_SEALBYTES);
  sodium.crypto_box_seal(
    encryptedItem,
    itemToEncrypt,
    b64.decode(encryptingPublicKey),
  );

  const decryptedItem = Buffer.alloc(encryptedItem.length - sodium.crypto_box_SEALBYTES);
  const decryptionSuccess = sodium.crypto_box_seal_open(
    decryptedItem,
    encryptedItem,
    b64.decode(encryptingPublicKey),
    b64.decode(encryptingPrivateKey),
  );
  if (
    !decryptionSuccess ||
    decryptedItem.toString() !== itemToEncrypt.toString()
  ){
    throw new Error('invalid keypair: failed to decrypt');
  }

  return true;
};
