'use strict';

const DID = require('../../jlinc-did');

describe('DID.createKeys', function() {
  it('should create a unique set of keys', function() {
    const a = DID.createKeys();

    expect({
      signingPublicKey: a.signingPublicKey,
      signingPrivateKey: a.signingPrivateKey,
    }).to.be.aCryptoSignKeypair();

    const b = DID.createKeys();
    expect(a.signingPublicKey).to.not.equal(b.signingPublicKey);
    expect(a.signingPrivateKey).to.not.equal(b.signingPrivateKey);
    expect(a.encryptingPublicKey).to.not.equal(b.encryptingPublicKey);
    expect(a.encryptingPrivateKey).to.not.equal(b.encryptingPrivateKey);
  });
});
