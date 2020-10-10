'use strict';

const didClient = require('../../jlinc-did');

describe('didClient.version', function() {
  it('should be 0.0.1', function(){
    expect(didClient.version).to.equal('0.0.1');
  });
});

describe('didClient.contextUrl', function() {
  it('should be "https://www.w3.org/ns/did/v1"', function(){
    expect(didClient.contextUrl).to.equal('https://www.w3.org/ns/did/v1');
  });
});
