'use strict';

const didClient = require('../../jlinc-did');
const didServer = require('./didServer');

const didServerHelpers = {
  didClient,
};

module.exports = function withDidServer(){

  before(async function() {
    Object.assign(this, didServerHelpers);
    await didServer.start();
    didClient.didServerUrl = didServer.url;
    this.SERVER_PUBLIC_KEY = didServer.PUBLIC_KEY;
  });

  beforeEach(async function(){
    await didServer.reset();
  });

};

