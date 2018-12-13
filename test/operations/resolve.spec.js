'use strict';

const withDidServer = require('../helpers/withDidServer');

describe('resolving a DID', function() {
  withDidServer();

  context('with an invalid DID id', function() {
    it('should respond with a 404 and success false', async function() {
      expect(
        await this.didClient.resolve('did:jlinc:xxxxxxxxxxxxxxxf4k31337k3yxxxxxxxxxxxxxxxx')
      ).to.matchPattern({
        success: false,
        status: 404,
        id: 'did:jlinc:xxxxxxxxxxxxxxxf4k31337k3yxxxxxxxxxxxxxxxx',
      });
    });
  });

  context('with a valid DID id', async function (){
    beforeEach(async function(){
      await this.registerDid();
    });

    it('should resolve the DID', async function() {
      const response = await this.didClient.resolve(this.didId);
      expect(response.success).to.be.true;
      expect(response.resolved).to.exist;
      expect(response.resolved.did).to.exist;
      const {
        ['@context']: context,
        created,
        id,
        publicKey
      } = response.resolved.did;
      expect(context).to.exist;
      expect(created).to.be.anISODateString();
      expect(id).to.equal(this.didId);
      expect(publicKey).to.have.lengthOf(2);
      expect(publicKey[0]).to.matchPattern({
        id: `${this.didId}#signing`,
        owner: this.didId,
        publicKeyBase64: this.entity.signingPublicKey,
        type: 'ed25519',
      });
      expect(publicKey[1]).to.matchPattern({
        id: `${this.didId}#encrypting`,
        owner: this.didId,
        publicKeyBase64: this.entity.encryptingPublicKey,
        type: 'curve25519',
      });
    });

    context('when the DID has been revoked', function() {
      beforeEach(async function() {
        await this.didClient.revokeDID(this.didId, this.entity.registrationSecret);
      });

      it('should respond with status 410', async function() {
        expect(await this.didClient.resolve(this.didId)).to.matchPattern({
          success: false,
          status: 410,
          id: this.didId,
        });
      });
    });

    context('when the DID has been superceded', function() {
      beforeEach(async function() {
        await this.registerDid();
        await this.supersedeDid({
          didId: this.didId,
          registrationSecret: this.entity.registrationSecret
        });
      });

      it('should respond with status 303', async function() {
        expect(
          await this.didClient.resolve(this.didId)
        ).to.matchPattern({
          success: false,
          status: 303,
          id: this.didId,
        });
        const response = await this.didClient.resolve(this.didId, false, true);
        expect(response.success).to.be.true;
        expect(response.resolved.did.id).to.equal(this.latestDidId);
      });

      context('when resolving root', function () {
        it('should resolve the current DID matching the original DID ID', async function() {
          const response = await this.didClient.resolve(this.didId, true);
          expect(response.success).to.be.true;
          const {
            resolved: {
              did: {
                ['@context']: context,
                created,
                id,
                publicKey
              }
            }
          } = response;

          expect(context).to.equal('https://w3id.org/did/v1');
          expect(created).to.be.anISODateString;
          expect(id).to.not.equal(this.didId);
          expect(id).equal(this.latestDidId);
          expect(publicKey[0]).to.matchPattern({
            id: `${this.latestDidId}#signing`,
            owner: this.latestDidId,
            publicKeyBase64: this.latestEntity.signingPublicKey,
            type: 'ed25519',
          });
          expect(publicKey[1]).to.matchPattern({
            id: `${this.latestDidId}#encrypting`,
            owner: this.latestDidId,
            publicKeyBase64: this.latestEntity.encryptingPublicKey,
            type: 'curve25519',
          });
        });
      });
    });

  });

});
