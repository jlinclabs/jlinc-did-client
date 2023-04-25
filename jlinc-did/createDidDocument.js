'use strict';

const b64 = require('urlsafe-base64');
const sodium = require('sodium-native');

module.exports = function createDidDocument(options = {}) {
  const { keys } = options;
  if (!keys) throw new Error('keys is required');
  if (!keys.signingPublicKey) throw new Error('keys.signingPublicKey is required');
  if (!keys.signingPrivateKey) throw new Error('keys.signingPrivateKey is required');
  if (!keys.encryptingPublicKey) throw new Error('keys.encryptingPublicKey is required');

  const id = `did:jlinc:${keys.signingPublicKey}`;
  const created = this.now();

  const didDocument = {
    '@context': this.contextUrl,
    id,
    created,
    publicKey: [
      {
        id: `${id}#signing`,
        type: 'ed25519',
        owner: id,
        publicKeyBase64: keys.signingPublicKey
      },
      {
        id: `${id}#encrypting`,
        type: 'curve25519',
        owner: id,
        publicKeyBase64: keys.encryptingPublicKey
      },
    ],
  };

  let hash = Buffer.alloc(sodium.crypto_hash_sha256_BYTES);
  sodium.crypto_hash_sha256(
    hash,
    Buffer.from(`${id}.${created}`)
  );
  let signature = Buffer.alloc(sodium.crypto_sign_BYTES);
  sodium.crypto_sign_detached(
    signature,
    hash,
    b64.decode(keys.signingPrivateKey)
  );
  signature = b64.encode(signature);

  return { didDocument, signature };
};
