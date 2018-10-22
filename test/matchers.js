'use strict';

const chai = require('chai');
const jsonwebtoken = require('jsonwebtoken');
const sodium = require('sodium').api;
const b64 = require('urlsafe-base64');

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
  expect(this._obj).to.have.lengthOf(43);
});

chai.Assertion.addMethod('aPrivateKey', function(){
  expect(this._obj).to.be.aBase64EncodedString();
  expect(this._obj).to.have.lengthOf(86);
});

chai.Assertion.addMethod('aSecret', function(){
  expect(this._obj).to.be.aBase64EncodedString();
  expect(this._obj).to.have.lengthOf(32);
});

chai.Assertion.addMethod('aCryptoSignKeypair', function(){
  const { publicKey, privateKey } = this._obj;
  const itemToSign = `${Math.random()} is my favorite number`;
  expect(
    sodium.crypto_sign_open(
      sodium.crypto_sign(
        Buffer.from(itemToSign, 'utf8'),
        b64.decode(privateKey),
      ),
      b64.decode(publicKey)
    ).toString()
  ).to.equal(itemToSign);
});

chai.Assertion.addMethod('aJlincEntity', function(){
  const entity = this._obj;
  expect(entity).to.be.an('object');
  expect(entity).to.have.all.keys('publicKey', 'privateKey', 'secret');
  expect(entity.publicKey).to.be.aPublicKey();
  expect(entity.privateKey).to.be.aPrivateKey();
  expect(entity.secret).to.be.aSecret();
  expect({
    publicKey: entity.publicKey,
    privateKey: entity.privateKey,
  }).to.be.aCryptoSignKeypair();
});
