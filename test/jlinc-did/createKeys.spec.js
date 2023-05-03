'use strict';

const { DidClient } = require('../..');

describe('DidClient.createKeys', function() {
  it('should create a unique set of keys', function() {
    const a = DidClient.createKeys();

    expect({
      signingPublicKey: a.signingPublicKey,
      signingPrivateKey: a.signingPrivateKey,
    }).to.be.aCryptoSignKeypair();

    const b = DidClient.createKeys();
    expect(a.signingPublicKey).to.not.equal(b.signingPublicKey);
    expect(a.signingPrivateKey).to.not.equal(b.signingPrivateKey);
    expect(a.encryptingPublicKey).to.not.equal(b.encryptingPublicKey);
    expect(a.encryptingPrivateKey).to.not.equal(b.encryptingPrivateKey);
  });
});
