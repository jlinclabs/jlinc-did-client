'use strict';

const { DidClient } = require('../..');

describe('DidClient.now', function() {
  it('should return the current time in as an ISO string', function(){
    expect(DidClient.now()).to.be.aNowishISOString();
  });
});
