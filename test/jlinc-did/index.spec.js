'use strict';

const DID = require('../../jlinc-did');

describe('DID.version', function() {
  it('should be 0.0.1', function(){
    expect(DID.version).to.equal('0.0.1');


    expect({
      doesMatchPatternWork: 'yes'
    }).to.matchPattern({
      doesMatchPatternWork: _.isString
    });
  });
});

describe('DID.contextUrl', function() {
  it('should be "https://w3id.org/did/v1"', function(){
    expect(DID.Conf.contextUrl).to.equal('https://w3id.org/did/v1');
  });
});
