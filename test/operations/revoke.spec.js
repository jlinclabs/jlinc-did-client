'use strict';

const withDidServer = require('../helpers/withDidServer');

describe('revoking a DID', function() {
  withDidServer();

  context('when DID does not exist', function() {
    it('should respond with a 404 and success false', async function() {
      const response = await this.didClient.revokeDID(
        'did:jlinc:xxxxxxxxxxxxxxxf4k31337k3yxxxxxxxxxxxxxxxx',
        'xxxxxxxxxxxxxxxxxxf4k31337r3g157r47109n53cr37xxxxxxxxxxxxxxxxxxx'
      );
      expect(response.success).to.be.false;
      expect(response.status).to.equal(401);
      expect(response.id).to.equal('did:jlinc:xxxxxxxxxxxxxxxf4k31337k3yxxxxxxxxxxxxxxxx');
      expect(response.error).to.equal('DID does not exist');
    });
  });

  context('with a valid DID id', async function (){
    beforeEach(async function(){
      await this.registerDid();
    });

    context('with an invalid registration secret', function() {
      it('should respond with the error "signature is invalid"', async function() {
        const response = await this.didClient.revokeDID(
          this.didId,
          'xxxxxxxxxxxxxxxxxxf4k31337r3g157r47109n53cr37xxxxxxxxxxxxxxxxxxx'
        );
        expect(response.success).to.be.false;
        expect(response.status).to.equal(401);
        expect(response.id).to.equal(this.didId);
        expect(response.error).to.equal('signature is invalid');
      });
    });

    context('with a valid registration secret', function() {
      it('should revoke the DID', async function() {
        let response = await this.didClient.revokeDID(
          this.didId,
          this.entity.registrationSecret,
        );
        expect(response.success).to.be.true;
        expect(response.revoked).to.equal(this.didId);
      });
    });
  });
});
