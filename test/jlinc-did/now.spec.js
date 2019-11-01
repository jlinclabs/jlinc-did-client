'use strict';

const didClient = require('../../jlinc-did');

describe('didClient.now', function() {
  it('should return the current time in as an ISO string', function(){
    expect(didClient.now()).to.be.aNowishISOString();
  });
});
