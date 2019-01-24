'use strict';

const sodium = require('sodium').api;
const b64 = require('urlsafe-base64');

const verifySigningKeypair = require('../../jlinc-did/verifySigningKeypair');

describe('verifySigningKeypair', function() {

  context('when given a valid signing key pair', function(){
    it('should return true', function(){
      const { publicKey, secretKey } = sodium.crypto_sign_keypair();
      expect(
        verifySigningKeypair({
          signingPublicKey: b64.encode(publicKey),
          signingPrivateKey: b64.encode(secretKey),
        })
      ).to.be.true;
    });
  });

  context('when given invalid arguments', function() {
    it('should throw an error', function() {
      const { publicKey, secretKey } = sodium.crypto_sign_keypair();
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
        verifySigningKeypair({ signingPublicKey: b64.encode(publicKey), signingPrivateKey: '123' });
      }).to.throw('argument secretKey must be (32U + 32U) bytes long');
      expect(() => {
        verifySigningKeypair({ signingPublicKey: '123', signingPrivateKey: b64.encode(secretKey) });
      }).to.throw('argument publicKey must be 32U bytes long');
    });
  });

  context('when given an invalid signing key pair', function(){
    it('should return false', function(){
      const { publicKey: signingPublicKey } = sodium.crypto_sign_keypair();
      const { secretKey: signingPrivateKey } = sodium.crypto_sign_keypair();
      expect(
        () => verifySigningKeypair({
          signingPublicKey: b64.encode(signingPublicKey),
          signingPrivateKey: b64.encode(signingPrivateKey),
        })
      ).to.throw('invalid keypair: failed to decode signed item');
    });
  });

});
