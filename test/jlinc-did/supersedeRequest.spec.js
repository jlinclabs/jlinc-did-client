'use strict';

const withDidServer = require('../helpers/withDidServer');

describe('jlincDid.supersedeRequest', function() {
  withDidServer();

  context('whe given an invalid arguments', function() {
    it('should throw an error', async function() {
      await expect(
        this.didClient.supersedeRequest({})
      ).to.be.rejectedWith('did is required');
      await expect(
        this.didClient.supersedeRequest({
          did: 'did:jlinc:xxxx',
        })
      ).to.be.rejectedWith('keys is required');
    });
  });

  context('whe given an valid did', function() {
    beforeEach(async function(){
      this.entity = await this.didClient.register();
      expect(this.entity).to.be.anEntity();
    });
    it('should return { newDid, challenge }', async function() {
      const { didClient, entity } = this;
      const keys = didClient.createKeys();
      expect(
        await didClient.supersedeRequest({ did: entity.did, keys})
      ).to.matchPattern({
        newDid: _.isDid,
        challenge: _.isString,
      });
    });
  });

});
