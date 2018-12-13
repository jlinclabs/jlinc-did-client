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
      Object.assign(this, await this.registerDid());
    });

    it('should return the history of the DID', async function() {
      const { resolved: { did: firstDid }} = await this.didClient.resolve(this.didId);
      expect (await this.didClient.history(this.didId)).to.matchPattern({
        success: true,
        history: [{ did: firstDid }],
      });

      let { latestDidId } = await this.supersedeDid({
        didId: this.didId,
        registrationSecret: this.entity.registrationSecret,
      });

      const { resolved: { did: secondDid }} = await this.didClient.resolve(latestDidId);
      expect({superseded: '2018-12-13T23:44:02Z'}).to.matchPattern({superseded: _.isString});
      expect (await this.didClient.history(this.didId)).to.matchPattern({
        success: true,
        history: [
          { did: firstDid, superseded: _.isString },
          { did: secondDid }
        ],
      });

      latestDidId = (await this.supersedeDid({
        didId: latestDidId,
        registrationSecret: this.entity.registrationSecret,
      })).latestDidId;

      const { resolved: { did: thirdDid }} = await this.didClient.resolve(latestDidId);
      expect (await this.didClient.history(this.didId)).to.matchPattern({
        success: true,
        history: [
          { did: firstDid, superseded: _.isString },
          { did: secondDid, superseded: _.isString },
          { did: thirdDid }
        ],
      });

      expect (await this.didClient.history(latestDidId)).to.matchPattern({
        success: true,
        history: [
          { did: firstDid, superseded: _.isString },
          { did: secondDid, superseded: _.isString },
          { did: thirdDid }
        ],
      });

      await this.didClient.revokeDID(latestDidId, this.entity.registrationSecret);
      expect (await this.didClient.history(latestDidId)).to.matchPattern({
        success: true,
        history: [
          { did: firstDid, superseded: _.isString },
          { did: secondDid, superseded: _.isString },
          { did: thirdDid, revoked: _.isString }
        ],
      });
    });
  });

});
