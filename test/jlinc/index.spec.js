'use strict';

const JLINC = require('../../didjlinc');

describe('JLINC.version', function() {
  it('should be 0.0.1', function(){
    expect(JLINC.version).to.equal('0.0.1');
  });
});

describe('JLINC.contextUrl', function() {
  it('should be "https://w3id.org/did/v1"', function(){
    expect(JLINC.contextUrl).to.equal('https://w3id.org/did/v1');
  });
});
