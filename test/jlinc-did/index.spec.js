'use strict';

const { DidClient } = require('../..');

describe('DidClient.version', function() {
  it('should be 1.0.0', function(){
    expect(DidClient.version).to.equal('1.0.0');
  });
});

describe('DidClient.getConfig().contextUrl', function() {
  it('should be "https://w3id.org/did/v1"', function(){
    expect(DidClient.getConfig().contextUrl).to.equal('https://w3id.org/did/v1');
  });
});
