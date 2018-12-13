'use strict';

const withDidServer = require('../helpers/withDidServer');

describe('getting the history of DID', function() {
  withDidServer();

  context('with an invalid DID id', function() {
    it('should respond with status 400', async function() {
      expect(
        await this.didClient.history('did:jlinc:xxxxxxxxxxxxxxxf4k31337k3yxxxxxxxxxxxxxxxx')
      ).to.matchPattern({
        success: false,
        status: 404,
        id: 'did:jlinc:xxxxxxxxxxxxxxxf4k31337k3yxxxxxxxxxxxxxxxx',
      });
    });
  });

  context('with a valid DID id', function(){
    beforeEach(async function(){
      const { confirmable, entity } = await this.registerDid();
      Object.assign(this, {
        didId: confirmable.id,
        entity,
      });
    });

    it('should return the history of the DID', async function() {
      const { resolved: { did: firstDid }} = await this.didClient.resolve(this.didId);
      expect (await this.didClient.history(this.didId)).to.matchPattern({
        success: true,
        history: [{ did: firstDid }],
      });

      await this.supersedeDid({
        didId: this.didId,
        registrationSecret: this.entity.registrationSecret,
      });
      const { resolved: { did: secondDid }} = await this.didClient.resolve(this.latestDidId);
      expect (await this.didClient.history(this.didId)).to.matchPattern({
        success: true,
        history: [
          { did: firstDid, superseded: _.isString },
          { did: secondDid }
        ],
      });

      await this.supersedeDid({
        didId: this.latestDidId,
        registrationSecret: this.entity.registrationSecret,
      });
      const { resolved: { did: thirdDid }} = await this.didClient.resolve(this.latestDidId);
      expect (await this.didClient.history(this.didId)).to.matchPattern({
        success: true,
        history: [
          { did: firstDid, superseded: _.isDate },
          { did: secondDid },
          { did: thirdDid }
        ],
      });
      expect (await this.didClient.history(this.latestDidId)).to.matchPattern({
        success: true,
        history: [
          { did: firstDid },
          { did: secondDid },
          { did: thirdDid }
        ],
      });

      await this.didClient.revokeDID(this.latestDidId, this.entity.registrationSecret);
      response = await this.didClient.history(this.latestDidId);
      expect(response.success).to.be.true;
      expect(response.history[0].did).to.deep.equal(firstDid);
      expect(response.history[0].superseded).to.exist;
      expect(response.history[1].did).to.deep.equal(secondDid);
      expect(response.history[1].superseded).to.exist;
      expect(response.history[2].did).to.deep.equal(thirdDid);
      expect(response.history[2].revoked).to.exist;
    });
  });

});
