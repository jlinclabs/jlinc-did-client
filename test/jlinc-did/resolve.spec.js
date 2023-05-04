'use strict';

const withDidServer = require('../helpers/withDidServer');

describe('jlincDid.resolve', function() {
  withDidServer();
  context('when the did exists', function(){
    beforeEach(async function(){
      const entity = await this.DidClient.register();
      Object.assign(this, { entity });
    });
    it('should return the did document', async function(){
      const { DidClient, entity } = this;

      expect( await DidClient.resolve({ did: entity.did }) ).to.matchPattern({
        '@context': DidClient.getConfig().contextUrl,
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
      const { DidClient } = this;
      await expect(
        DidClient.resolve({ did: 'did:jlinc:SHDDlR-jr4JYa7FqFNaRd495p1Sm3eir2jVVVRf09j0' })
      ).to.be.rejectedWith(DidClient.DIDNotFoundError, 'did not found');
    });
  });
});
