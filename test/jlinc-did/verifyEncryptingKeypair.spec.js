'use strict';

const sodium = require('sodium').api;
const b64 = require('urlsafe-base64');

const verifyEncryptingKeypair = require('../../jlinc-did/verifyEncryptingKeypair');

describe('verifyEncryptingKeypair', function() {

  context('when given a valid encrypting key pair', function(){
    it('should return true', function(){
      const { publicKey, secretKey } = sodium.crypto_box_keypair();
      expect(
        verifyEncryptingKeypair({
          encryptingPublicKey: b64.encode(publicKey),
          encryptingPrivateKey: b64.encode(secretKey),
        })
      ).to.be.true;
    });
  });

  context('when given invalid arguments', function() {
    it('should throw an error', function() {
      const { publicKey, secretKey } = sodium.crypto_box_keypair();
      expect(() => {
        verifyEncryptingKeypair({});
      }).to.throw('encryptingPublicKey is required');
      expect(() => {
        verifyEncryptingKeypair({ encryptingPublicKey: '123' });
      }).to.throw('encryptingPrivateKey is required');
      expect(() => {
        verifyEncryptingKeypair({ encryptingPublicKey: {}, encryptingPrivateKey: '123' });
      }).to.throw('encryptingPublicKey must of type string');
      expect(() => {
        verifyEncryptingKeypair({ encryptingPublicKey: '123', encryptingPrivateKey: {} });
      }).to.throw('encryptingPrivateKey must of type string');
      expect(() => {
        verifyEncryptingKeypair({ encryptingPublicKey: b64.encode(publicKey), encryptingPrivateKey: '123' });
      }).to.throw('argument secretKey must be 32U bytes long');
      expect(() => {
        verifyEncryptingKeypair({ encryptingPublicKey: '123', encryptingPrivateKey: b64.encode(secretKey) });
      }).to.throw('argument publicKey must be 32U bytes long');
    });
  });

  context('when given an invalid signing key pair', function(){
    it('should return false', function(){
      const { publicKey: encryptingPublicKey } = sodium.crypto_box_keypair();
      const { secretKey: encryptingPrivateKey } = sodium.crypto_box_keypair();
      expect(
        () => verifyEncryptingKeypair({
          encryptingPublicKey: b64.encode(encryptingPublicKey),
          encryptingPrivateKey: b64.encode(encryptingPrivateKey),
        })
      ).to.throw('invalid keypair: failed to decrypt');
    });
  });

});
