'use strict';

const { DidClient } = require('../..');
const didServer = require('./didServer');

const didServerHelpers = {
  DidClient,
};

module.exports = function withDidServer(){

  before(async function() {
    Object.assign(this, didServerHelpers);
    await didServer.start();
    DidClient.getConfig().didServerUrl = didServer.url;
    this.SERVER_PUBLIC_KEY = didServer.PUBLIC_KEY;
  });

  beforeEach(async function(){
    await didServer.reset();
  });

};

