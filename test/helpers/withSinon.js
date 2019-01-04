'use strict';

const sinon = require('sinon');

module.exports = function withSinon(){
  beforeEach(function(){
    this.sinon = sinon.createSandbox();
  });
  afterEach(function() {
    this.sinon.restore();
  });
};
