'use strict';

const withDidServer = require('../helpers/withDidServer');

describe('registerings two DIDs', function() {
  withDidServer();

  it('should work', async function() {
    const { didClient } = this;

    const bob = await didClient.register();
    expect(bob).to.be.anEntity();

    expect(
      await didClient.resolve({ did: bob.did })
    ).to.matchPattern({
      '@context': didClient.contextUrl,
      created: _.isDatetimeInISOFormat,
      id: bob.did,
      publicKey: [
        {
          id: `${bob.did}#signing`,
          controller: bob.did,
          publicKeyBase58: didClient.b58.b64tob58(bob.signingPublicKey),
          type: "Ed25519VerificationKey2018",
        },
        {
          id: `${bob.did}#encrypting`,
          controller: bob.did,
          publicKeyBase58: didClient.b58.b64tob58(bob.encryptingPublicKey),
          type: "X25519KeyAgreementKey2019",
        }
      ]
    });

    const alice = await didClient.register();
    expect(alice).to.be.anEntity();

    expect(
      await didClient.resolve({ did: alice.did })
    ).to.matchPattern({
      '@context': didClient.contextUrl,
      created: _.isDatetimeInISOFormat,
      id: alice.did,
      publicKey: [
        {
          id: `${alice.did}#signing`,
          controller: alice.did,
          publicKeyBase58: didClient.b58.b64tob58(alice.signingPublicKey),
          type: "Ed25519VerificationKey2018",
        },
        {
          id: `${alice.did}#encrypting`,
          controller: alice.did,
          publicKeyBase58: didClient.b58.b64tob58(alice.encryptingPublicKey),
          type: "X25519KeyAgreementKey2019",
        }
      ]
    });

    expect(bob.did).to.not.equal(alice.did);
    expect(bob.signingPublicKey).to.not.equal(alice.signingPublicKey);
    expect(bob.signingPrivateKey).to.not.equal(alice.signingPrivateKey);
    expect(bob.encryptingPublicKey).to.not.equal(alice.encryptingPublicKey);
    expect(bob.encryptingPrivateKey).to.not.equal(alice.encryptingPrivateKey);
    expect(bob.registrationSecret).to.not.equal(alice.registrationSecret);
  });
});
