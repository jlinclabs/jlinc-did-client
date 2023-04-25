'use strict';

const createKeys = require('../../jlinc-did/createKeys');
const verifySigningKeypair = require('../../jlinc-did/verifySigningKeypair');

describe('verifySigningKeypair', function() {

  context('when given a valid signing key pair', function(){
    it('should return true', function(){
      const { signingPublicKey, signingPrivateKey } = createKeys();
      expect(
        verifySigningKeypair({ signingPublicKey, signingPrivateKey })
      ).to.be.true;
    });
  });

  context('when given invalid arguments', function() {
    it('should throw an error', function() {
      const { signingPublicKey, signingPrivateKey } = createKeys();
      expect(() => {
        verifySigningKeypair({});
      }).to.throw('signingPublicKey is required');
      expect(() => {
        verifySigningKeypair({ signingPublicKey: '123' });
      }).to.throw('signingPrivateKey is required');
      expect(() => {
        verifySigningKeypair({ signingPublicKey: {}, signingPrivateKey: '123' });
      }).to.throw('signingPublicKey must of type string');
      expect(() => {
        verifySigningKeypair({ signingPublicKey: '123', signingPrivateKey: {} });
      }).to.throw('signingPrivateKey must of type string');
      expect(() => {
        verifySigningKeypair({ signingPublicKey, signingPrivateKey: '123' });
      }).to.throw('"sk" must be crypto_sign_SECRETKEYBYTES bytes long');
      expect(() => {
        verifySigningKeypair({ signingPublicKey: '123', signingPrivateKey });
      }).to.throw('"pk" must be crypto_sign_PUBLICKEYBYTES bytes long');
    });
  });

  context('when given an invalid signing key pair', function(){
    it('should return false', function(){
      const { signingPublicKey } = createKeys();
      const { signingPrivateKey } = createKeys();
      expect(
        () => verifySigningKeypair({ signingPublicKey, signingPrivateKey })
      ).to.throw('invalid keypair: failed to decode signed item');
    });
  });

});
