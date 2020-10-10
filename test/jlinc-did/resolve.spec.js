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
            controller: entity.did,
            publicKeyBase58: didClient.b58.b64tob58(entity.signingPublicKey),
            type: "Ed25519VerificationKey2018",
          },
          {
            id: `${entity.did}#encrypting`,
            controller: entity.did,
            publicKeyBase58: didClient.b58.b64tob58(entity.encryptingPublicKey),
            type: "X25519KeyAgreementKey2019",
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
