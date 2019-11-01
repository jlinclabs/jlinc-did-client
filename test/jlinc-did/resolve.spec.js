'use strict';

const withDidServer = require('../helpers/withDidServer');

describe('jlincDid.resolve', function() {
  withDidServer();
  context('when the did exists', function(){
    beforeEach(async function(){
      const entity = await this.didClient.register();
      Object.assign(this, { entity });
    });
    it('should return the did document', async function(){
      const { didClient, entity } = this;

      expect( await didClient.resolve({ did: entity.did }) ).to.matchPattern({
        '@context': didClient.contextUrl,
        created: _.isDatetimeInISOFormat,
        id: entity.did,
        publicKey: [
          {
            id: `${entity.did}#signing`,
            owner: entity.did,
            publicKeyBase64: entity.signingPublicKey,
            type: "ed25519",
          },
          {
            id: `${entity.did}#encrypting`,
            owner: entity.did,
            publicKeyBase64: entity.encryptingPublicKey,
            type: "curve25519",
          }
        ]
      });
    });
  });

  context('when the did doesnt exist', function(){
    it('should return the did document', async function(){
      const { didClient } = this;
      await expect(
        didClient.resolve({ did: 'did:jlinc:SHDDlR-jr4JYa7FqFNaRd495p1Sm3eir2jVVVRf09j0' })
      ).to.be.rejectedWith(didClient.DIDNotFoundError, 'did not found');
    });
  });
});
