'use strict';

const withDidServer = require('../helpers/withDidServer');

describe('jlincDid.registerRequest', function() {
  withDidServer();

  it('should return a registered entity', async function() {
    const entity = await this.didClient.register();
    expect(entity).to.be.anEntity();
  });
  context('when given a valid keys', function(){
    beforeEach(async function(){
      this.keys = this.didClient.createKeys();
    });
    it('uses those keys', async function(){
      const { keys } = this;
      const entity = await this.didClient.register({ keys });
      expect(entity).to.be.anEntity();
      expect(entity.signingPublicKey).to.equal(keys.signingPublicKey);
      expect(entity.signingPrivateKey).to.equal(keys.signingPrivateKey);
      expect(entity.encryptingPublicKey).to.equal(keys.encryptingPublicKey);
      expect(entity.encryptingPrivateKey).to.equal(keys.encryptingPrivateKey);
    });
  });

});
