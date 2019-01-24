'use strict';

const sodium = require('sodium').api;
const b64 = require('urlsafe-base64');

module.exports = function verifyEncryptingKeypair({ encryptingPublicKey, encryptingPrivateKey }) {
  if (!encryptingPublicKey) throw new Error('encryptingPublicKey is required');
  if (!encryptingPrivateKey) throw new Error('encryptingPrivateKey is required');
  if (typeof encryptingPublicKey !== 'string') throw new Error('encryptingPublicKey must of type string');
  if (typeof encryptingPrivateKey !== 'string') throw new Error('encryptingPrivateKey must of type string');

  const senderPublicKey = b64.decode(encryptingPublicKey);
  const senderPrivateKey = b64.decode(encryptingPrivateKey);
  const { publicKey: recieverPublicKey, secretKey: recieverPrivateKey } = sodium.crypto_box_keypair();
  const secret = Buffer.allocUnsafe(sodium.crypto_box_NONCEBYTES);
  sodium.randombytes(secret);

  const itemToEncrypt = Buffer.from(`Drop and give me ${Math.floor(Math.random() * 10000)}`, 'utf-8');

  const encryptedItem = sodium.crypto_box(
    itemToEncrypt,
    secret,
    recieverPublicKey,
    senderPrivateKey
  );

  if (!encryptedItem) throw new Error('invalid keypair: failed to encrypt');

  const decryptedItem = sodium.crypto_box_open(
    encryptedItem,
    secret,
    senderPublicKey,
    recieverPrivateKey
  );

  if (!decryptedItem) throw new Error('invalid keypair: failed to decrypt');

  return true;
};
