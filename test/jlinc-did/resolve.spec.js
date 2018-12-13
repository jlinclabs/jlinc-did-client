'use strict';

const withDidServer = require('../helpers/withDidServer');

describe('resolving a DID', function() {
  withDidServer();

  context('with an invalid DID id', function() {
    it('should respond with a 404 and success false', async function() {
      const response = await this.didClient.resolve('did:jlinc:na9qhcfLVpiulTxKR137qm0t9yVpI-fHxdTc0R2DoqI');
      expect(response.success).to.be.false;
      expect(response.status).to.equal(404);
      expect(response.id).to.equal('did:jlinc:na9qhcfLVpiulTxKR137qm0t9yVpI-fHxdTc0R2DoqI');
      expect(response.error).to.be.undefined;
    });
  });

  context('when the DID has been revoked', function() {
    it('should have a test');
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

    context('when the DID has been superceded', function() {
      it('should have a test');

      context('when resolving root', function () {
        beforeEach(async function() {
          // TODO superced
        });
        it('should resolve the current DID matching the original DID ID', async function() {
          // const response = await this.didClient.resolve(this.didId, true);
        });
      });
    });

  });

});
