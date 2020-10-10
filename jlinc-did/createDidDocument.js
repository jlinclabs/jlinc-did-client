'use strict';

const b64 = require('urlsafe-base64');
const sodium = require('sodium').api;

module.exports = function createDidDocument(options = {}) {
  const { b64tob58 } = this.b58;
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
        type: 'Ed25519VerificationKey2018',
        controller: id,
        publicKeyBase58: b64tob58(keys.signingPublicKey)
      },
      {
        id: `${id}#encrypting`,
        type: 'X25519KeyAgreementKey2019',
        controller: id,
        publicKeyBase58: b64tob58(keys.encryptingPublicKey)
      },
    ],
  };

  const signature = b64.encode(
    sodium.crypto_sign_detached(
      sodium.crypto_hash_sha256(
        Buffer.from(`${id}.${created}`)
      ),
      b64.decode(keys.signingPrivateKey)
    )
  );

  return { didDocument, signature };
};
