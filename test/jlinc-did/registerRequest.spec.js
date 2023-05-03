'use strict';

const withDidServer = require('../helpers/withDidServer');

describe('jlincDid.registerRequest', function() {
  withDidServer();

  context('when given an invalid keys', function(){
    it('should throw and error', async function() {
      const keys = this.DidClient.createKeys();

      await expect(
        this.DidClient.registerRequest({})
      ).to.be.rejectedWith('keys is required');

      await expect(
        this.DidClient.registerRequest({
          keys: {},
        })
      ).to.be.rejectedWith('keys.encryptingPrivateKey is required');

      await expect(
        this.DidClient.registerRequest({
          keys: {
            encryptingPrivateKey: keys.encryptingPrivateKey,
          },
        })
      ).to.be.rejectedWith('keys.signingPublicKey is required');

      await expect(
        this.DidClient.registerRequest({
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
      this.keys = this.DidClient.createKeys();
    });
    it('should return { did, registrationSecret, challenge }', async function() {
      const { keys } = this;
      expect(
        await this.DidClient.registerRequest({ keys })
      ).to.matchPattern({
        did: _.isDid,
        registrationSecret: _.isString,
        challenge: _.isString,
      });
    });

    context('that have already been used', function(){
      beforeEach(async function(){
        await this.DidClient.registerRequest({ keys: this.keys });
      });
      it('should throw an error', async function() {
        await expect(
          this.DidClient.registerRequest({ keys: this.keys })
        ).to.be.rejectedWith('pq: duplicate key value violates unique constraint "didstore_pkey"');
      });
    });
  });

});
