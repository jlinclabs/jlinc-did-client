'use strict';

const DID = require('../../jlinc-did');

describe('DID.createEntity', function() {
  it('should create a unique set of values', function() {
    expect( DID.createEntity() ).to.be.aDidEntity();
    const a = DID.createEntity();
    const b = DID.createEntity();
    expect(a.signingPublicKey).to.not.equal(b.signingPublicKey);
    expect(a.signingPrivateKey).to.not.equal(b.signingPrivateKey);
    expect(a.encryptingPublicKey).to.not.equal(b.encryptingPublicKey);
    expect(a.encryptingPrivateKey).to.not.equal(b.encryptingPrivateKey);
    expect(a.registrationSecret).to.not.equal(b.registrationSecret);
  });
});
