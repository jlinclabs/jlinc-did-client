'use strict';

const b64 = require('urlsafe-base64');

const createKeys = require('../../jlinc-did/createKeys');
const verifyEncryptingKeypair = require('../../jlinc-did/verifyEncryptingKeypair');

describe('verifyEncryptingKeypair', function() {

  context('when given a valid encrypting key pair', function(){
    it('should return true', function(){
      const { encryptingPublicKey, encryptingPrivateKey } = createKeys();
      expect(
        verifyEncryptingKeypair({
          encryptingPublicKey: b64.encode(encryptingPublicKey),
          encryptingPrivateKey: b64.encode(encryptingPrivateKey),
        })
      ).to.be.true;
    });
  });

  context('when given invalid arguments', function() {
    it('should throw an error', function() {
      const { encryptingPublicKey, encryptingPrivateKey } = createKeys();
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
        verifyEncryptingKeypair({ encryptingPublicKey: b64.encode(encryptingPublicKey), encryptingPrivateKey: '123' });
      }).to.throw('"sk" must be crypto_box_SECRETKEYBYTES bytes long');
      expect(() => {
        verifyEncryptingKeypair({ encryptingPublicKey: '123', encryptingPrivateKey: b64.encode(encryptingPrivateKey) });
      }).to.throw('"pk" must be crypto_box_PUBLICKEYBYTES bytes long');
    });
  });

  context('when given an invalid signing key pair', function(){
    it('should return false', function(){
      const { encryptingPublicKey } = createKeys();
      const { encryptingPrivateKey } = createKeys();
      expect(
        () => verifyEncryptingKeypair({
          encryptingPublicKey: b64.encode(encryptingPublicKey),
          encryptingPrivateKey: b64.encode(encryptingPrivateKey),
        })
      ).to.throw('invalid keypair: failed to decrypt');
    });
  });

});
