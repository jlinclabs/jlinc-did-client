'use strict';

const withDidServer = require('../helpers/withDidServer');

describe('jlincDid.registerRequest', function() {
  withDidServer();

  context('when given an invalid keys', function(){
    it('should throw and error', async function() {
      const keys = this.didClient.createKeys();

      await expect(
        this.didClient.registerRequest({})
      ).to.be.rejectedWith('keys is required');

      await expect(
        this.didClient.registerRequest({
          keys: {},
        })
      ).to.be.rejectedWith('keys.encryptingPrivateKey is required');

      await expect(
        this.didClient.registerRequest({
          keys: {
            encryptingPrivateKey: keys.encryptingPrivateKey,
          },
        })
      ).to.be.rejectedWith('keys.signingPublicKey is required');

      await expect(
        this.didClient.registerRequest({
          keys: {
            encryptingPrivateKey: keys.encryptingPrivateKey,
            signingPublicKey: keys.signingPublicKey,
          },
        })
      ).to.be.rejectedWith('keys.signingPrivateKey is required');
    });
  });

  context('when given valid keys', function(){
    beforeEach(async function(){
      this.keys = this.didClient.createKeys();
    });
    it('should return { did, registrationSecret, challenge }', async function() {
      const { keys } = this;
      expect(
        await this.didClient.registerRequest({ keys })
      ).to.matchPattern({
        did: _.isDid,
        registrationSecret: _.isString,
        challenge: _.isString,
      });
    });

    context('that have already been used', function(){
      beforeEach(async function(){
        await this.didClient.registerRequest({ keys: this.keys });
      });
      it('should throw an error', async function() {
        await expect(
          this.didClient.registerRequest({ keys: this.keys })
        ).to.be.rejectedWith('pq: duplicate key value violates unique constraint "didstore_pkey"');
      });
    });
  });

});
