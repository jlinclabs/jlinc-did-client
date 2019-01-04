'use strict';

const { inspect } = require('util');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const chaiMatchPattern = require('chai-match-pattern');
const sinonChai = require('sinon-chai');
const jsonwebtoken = require('jsonwebtoken');
const sodium = require('sodium').api;
const b64 = require('urlsafe-base64');

chai.use(chaiAsPromised);
chai.use(chaiMatchPattern);
chai.use(sinonChai);

global.expect = chai.expect;
global._ = chaiMatchPattern.getLodashModule();

global.console.inspect = function(...args){
  return global.console.log(...args.map(arg => inspect(arg, { showHidden: true, depth: null })));
};

global.console.json = function(...args) {
  return global.console.log(args.map(o => JSON.stringify(o, null, 2)).join("\n"));
};

chai.Assertion.addMethod('aJwt', function(){
  expect(this._obj).to.match(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/);
});

chai.Assertion.addMethod('aJwtSignedWith', function(secretOrPrivateKey){
  expect(this._obj).to.be.aJwt();
  jsonwebtoken.verify(this._obj, secretOrPrivateKey);
});

chai.Assertion.addMethod('aJwtEncodingOf', function(expectedObject){
  expect(this._obj).to.be.aJwt();
  const decoded = jsonwebtoken.decode(this._obj);
  if (!('iat' in expectedObject)) delete decoded.iat;
  expect( decoded ).to.deep.equal(expectedObject);
});

chai.Assertion.addMethod('aBase64EncodedString', function(){
  expect(this._obj).to.be.a('string');
  // taken from https://github.com/RGBboy/urlsafe-base64/blob/master/lib/urlsafe-base64.js#L75
  expect(this._obj).to.match(/^[A-Za-z0-9\-_]+$/);
});

chai.Assertion.addMethod('aDatetimeInISOFormat', function(){
  const date = new Date(this._obj);
  expect(this._obj).to.equal(date.toISOString());
});

chai.Assertion.addMethod('aRecentSecondsFromEpochInteger', function(){
  const now = Math.floor(Date.now() / 1000);
  expect(this._obj).to.be.within(now - 1, now);
});

chai.Assertion.addMethod('aNonce', function(){
  expect(this._obj).to.match(/^[0-9a-f]{64}$/);
});

chai.Assertion.addMethod('serializable', function(){
  expect(
    JSON.parse(JSON.stringify(this._obj))
  ).to.deep.equal(this._obj);
});

chai.Assertion.addMethod('aPublicKey', function(){
  expect(this._obj).to.be.aBase64EncodedString();
  expect(b64.decode(this._obj)).to.have.lengthOf(sodium.crypto_sign_PUBLICKEYBYTES);
});

chai.Assertion.addMethod('aPrivateKey', function(){
  expect(this._obj).to.be.aBase64EncodedString();
  expect(b64.decode(this._obj)).to.have.lengthOf(sodium.crypto_sign_SECRETKEYBYTES);
});

chai.Assertion.addMethod('anEncryptingPublicKey', function(){
  expect(this._obj).to.be.aBase64EncodedString();
  expect(b64.decode(this._obj)).to.have.lengthOf(sodium.crypto_box_PUBLICKEYBYTES);
});

chai.Assertion.addMethod('anEncryptingPrivateKey', function(){
  expect(this._obj).to.be.aBase64EncodedString();
  expect(b64.decode(this._obj)).to.have.lengthOf(sodium.crypto_box_SECRETKEYBYTES);
});

chai.Assertion.addMethod('aRegistrationSecret', function(){
  expect(this._obj).to.be.aBase64EncodedString();
  expect(b64.decode(this._obj)).to.have.lengthOf(48);
});

chai.Assertion.addMethod('aDid', function () {
  expect(this._obj).to.match(/^did:jlinc:.*$/);
});

chai.Assertion.addMethod('aCryptoSignKeypair', function(){
  const { signingPublicKey, signingPrivateKey } = this._obj;
  const itemToSign = `${Math.random()} is my favorite number`;
  expect(
    sodium.crypto_sign_open(
      sodium.crypto_sign(
        Buffer.from(itemToSign, 'utf8'),
        b64.decode(signingPrivateKey),
      ),
      b64.decode(signingPublicKey)
    ).toString()
  ).to.equal(itemToSign);
});

chai.Assertion.addMethod('anEntity', function(){
  const entity = this._obj;
  expect(entity).to.be.an('object');
  expect(entity).to.include.keys(
    'did',
    'registrationSecret',
    'signingPublicKey',
    'signingPrivateKey',
    'encryptingPublicKey',
    'encryptingPrivateKey',
  );
  expect(entity.did).to.be.aDid();
  expect(entity.registrationSecret).to.be.aRegistrationSecret();
  expect(entity.signingPublicKey).to.be.aPublicKey();
  expect(entity.signingPrivateKey).to.be.aPrivateKey();
  expect(entity.encryptingPublicKey).to.be.anEncryptingPublicKey();
  expect(entity.encryptingPrivateKey).to.be.anEncryptingPrivateKey();
  expect({
    signingPublicKey: entity.signingPublicKey,
    signingPrivateKey: entity.signingPrivateKey,
  }).to.be.aCryptoSignKeypair();
});


chai.Assertion.addMethod('anISODateString', function(){
  expect(this._obj).to.match(/^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.\d\d\dZ$/);
});


_.mixin({

  isDateString(target){
    return _.isString(target) && target.match(/^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d(.\d+)?Z$/);
  },

  isDatetimeInISOFormat(target){
    expect(target).to.be.aDatetimeInISOFormat();
    return true;
  },

  isDid(target){
    expect(target).to.be.aDid();
    return true;
  },

  isEntity(target){
    expect(target).to.be.anEntity();
    return true;
  },

});
