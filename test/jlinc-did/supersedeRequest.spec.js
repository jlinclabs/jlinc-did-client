'use strict';

const withDidServer = require('../helpers/withDidServer');

describe('jlincDid.supersedeRequest', function() {
  withDidServer();

  context('whe given an invalid arguments', function() {
    it('should throw an error', async function() {
      await expect(
        this.DidClient.supersedeRequest({})
      ).to.be.rejectedWith('did is required');
      await expect(
        this.DidClient.supersedeRequest({
          did: 'did:jlinc:xxxx',
        })
      ).to.be.rejectedWith('keys is required');
    });
  });

  context('whe given an valid did', function() {
    beforeEach(async function(){
      this.entity = await this.DidClient.register();
      expect(this.entity).to.be.anEntity();
    });
    it('should return { newDid, challenge }', async function() {
      const { DidClient, entity } = this;
      const keys = DidClient.createKeys();
      expect(
        await DidClient.supersedeRequest({ did: entity.did, keys})
      ).to.matchPattern({
        newDid: _.isDid,
        challenge: _.isString,
      });
    });
  });

});
