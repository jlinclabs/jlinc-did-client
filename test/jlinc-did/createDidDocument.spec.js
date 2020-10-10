'use strict';

const b64 = require('urlsafe-base64');
const sodium = require('sodium').api;

const didClient = require('../../jlinc-did');

describe('didClient.createDidDocument', function() {
  it('should be a function', function() {
    expect(didClient.createDidDocument).to.be.a('function');
  });
  it('should require keys', function() {
    const expectArgs = args =>
      expect(() => didClient.createDidDocument(args))
    ;
    expectArgs({}).to.throw('keys is required');
    expectArgs({
      keys: {
      },
    }).to.throw('keys.signingPublicKey is required');
    expectArgs({
      keys: {
        signingPublicKey: 'x',
      },
    }).to.throw('keys.signingPrivateKey is required');
    expectArgs({
      keys: {
        signingPublicKey: 'x',
        signingPrivateKey: 'x',
      },
    }).to.throw('keys.encryptingPublicKey is required');
  });
  it('should created a didDocument signed with those keys', function(){
    const keys = didClient.createKeys();
    const result =  didClient.createDidDocument({ keys });
    expect(result).to.have.all.keys(['didDocument', 'signature']);
    const id = `did:jlinc:${keys.signingPublicKey}`;
    expect(result.didDocument.created).to.be.aNowishISOString();
    expect(result.didDocument).to.deep.equal({
      '@context': didClient.contextUrl,
      id,
      created: result.didDocument.created,
      publicKey: [
        {
          id: `${id}#signing`,
          type: 'Ed25519VerificationKey2018',
          controller: id,
          "publicKeyBase58": didClient.b58.b64tob58(keys.signingPublicKey)
        },
        {
          id: `${id}#encrypting`,
          type: 'X25519KeyAgreementKey2019',
          controller: id,
          "publicKeyBase58": didClient.b58.b64tob58(keys.encryptingPublicKey)
        },
      ],
    });

    expect(
      sodium.crypto_sign_verify_detached(
        b64.decode(result.signature),
        sodium.crypto_hash_sha256(
          Buffer.from(`${result.didDocument.id}.${result.didDocument.created}`),
        ),
        b64.decode(keys.signingPublicKey)
      )
    ).to.be.true;

  });
});
