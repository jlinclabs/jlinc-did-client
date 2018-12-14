'use strict';

process.env.NODE_ENV = 'test';

const { inspect } = require('util');
const chai = require('chai');
const chaiMatchPattern = require('chai-match-pattern');

require('./matchers');

chai.use(chaiMatchPattern);

console.log('assigning global._', ['was:', global._]);

global._ = chaiMatchPattern.getLodashModule();
global.expect = chai.expect;

expect({
  doesMatchPatternWork: 'yes'
}).to.matchPattern({
  doesMatchPatternWork: _.isString
});

global.console.inspect = function(...args){
  return global.console.log(...args.map(arg => inspect(arg, { showHidden: true, depth: null })));
};

global.console.json = function(...args) {
  return global.console.log(args.map(o => JSON.stringify(o, null, 2)).join("\n"));
};
