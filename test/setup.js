'use strict';

process.env.NODE_ENV = 'test';

const { inspect } = require('util');
const chai = require('chai');
require('./matchers');

global.expect = chai.expect;

global.console.inspect = function(...args){
  return global.console.log(...args.map(arg => inspect(arg, { showHidden: true, depth: null })));
};

global.console.json = function(...args) {
  return global.console.log(args.map(o => JSON.stringify(o, null, 2)).join("\n"));
};
