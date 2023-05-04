'use strict';

const { DidClient } = require('../..');

describe('DidClient.createNonce', function() {
  it('should create a none', function() {
    const nonce = DidClient.createNonce();
    expect(nonce).to.be.a('string');
    expect(nonce).to.match(/^[a-z0-9]{64}$/);

    const set = new Set;
    let n = 100;
    while(n--){ set.add(DidClient.createNonce()); }
    expect(set).to.have.lengthOf(100);
  });
});
