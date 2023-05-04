'use strict';

const withDidServer = require('../helpers/withDidServer');

describe('registerings two DIDs', function() {
  withDidServer();

  it('should work', async function() {
    const { DidClient } = this;

    const bob = await DidClient.register();
    expect(bob).to.be.anEntity();

    expect(
      await DidClient.resolve({ did: bob.did })
    ).to.matchPattern({
      '@context': DidClient.getConfig().contextUrl,
      created: _.isDatetimeInISOFormat,
      id: bob.did,
      publicKey: [
        {
          id: `${bob.did}#signing`,
          owner: bob.did,
          publicKeyBase64: bob.signingPublicKey,
          type: "ed25519",
        },
        {
          id: `${bob.did}#encrypting`,
          owner: bob.did,
          publicKeyBase64: bob.encryptingPublicKey,
          type: "curve25519",
        }
      ]
    });

    const alice = await DidClient.register();
    expect(alice).to.be.anEntity();

    expect(
      await DidClient.resolve({ did: alice.did })
    ).to.matchPattern({
      '@context': DidClient.getConfig().contextUrl,
      created: _.isDatetimeInISOFormat,
      id: alice.did,
      publicKey: [
        {
          id: `${alice.did}#signing`,
          owner: alice.did,
          publicKeyBase64: alice.signingPublicKey,
          type: "ed25519",
        },
        {
          id: `${alice.did}#encrypting`,
          owner: alice.did,
          publicKeyBase64: alice.encryptingPublicKey,
          type: "curve25519",
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
