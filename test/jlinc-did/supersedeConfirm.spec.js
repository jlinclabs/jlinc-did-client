'use strict';

const withDidServer = require('../helpers/withDidServer');

describe('jlincDid.supersedeConfirm', function() {
  withDidServer();

  context('whe given invalid arguments', function() {
    it('should throw an error', async function() {
      await expect(
        this.DidClient.supersedeConfirm({})
      ).to.be.rejectedWith('entity is required');

      await expect(
        this.DidClient.supersedeConfirm({
          entity: {},
        })
      ).to.be.rejectedWith('entity.registrationSecret is required');

      await expect(
        this.DidClient.supersedeConfirm({
          entity: {
            registrationSecret: 'xxxx',
          },
        })
      ).to.be.rejectedWith('keys is required');

      await expect(
        this.DidClient.supersedeConfirm({
          entity: {
            registrationSecret: 'xxxx',
          },
          keys: {},
        })
      ).to.be.rejectedWith('keys.signingPrivateKey is required');

      await expect(
        this.DidClient.supersedeConfirm({
          entity: {
            registrationSecret: 'xxxx',
          },
          keys: {
            signingPrivateKey: 'yyyy',
          },
        })
      ).to.be.rejectedWith('newDid is required');

      await expect(
        this.DidClient.supersedeConfirm({
          entity: {
            registrationSecret: 'xxxx',
          },
          keys: {
            signingPrivateKey: 'yyyy',
          },
          newDid: 'dddd',
        })
      ).to.be.rejectedWith('challenge is required');

    });
  });

  context('whe given valid arguments', function() {
    beforeEach(async function(){
      this.entity = await this.DidClient.register();
      this.keys = this.DidClient.createKeys();
      const { newDid, challenge } = await this.DidClient.supersedeRequest({ did: this.entity.did, keys: this.keys });
      this.newDid = newDid;
      this.challenge = challenge;
    });
    it('should return { newDid, challenge }', async function() {
      const { entity, keys, newDid, challenge } = this;
      expect(
        await this.DidClient.supersedeConfirm({ entity, keys, newDid, challenge })
      ).to.deep.equal({
        did: newDid,
        encryptingPrivateKey: keys.encryptingPrivateKey,
        encryptingPublicKey: keys.encryptingPublicKey,
        signingPrivateKey: keys.signingPrivateKey,
        signingPublicKey: keys.signingPublicKey,
        registrationSecret: entity.registrationSecret,
      });
    });
  });

});
