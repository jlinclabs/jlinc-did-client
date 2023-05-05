'use strict';

const withDidServer = require('../helpers/withDidServer');

describe('jlincDid.history', function() {
  withDidServer();

  context('when given an invalid did', function() {
    it('should throw an error', async function() {
      const { DidClient } = this;
      await expect(
        DidClient.history({ did: 'did:jlinc:xxxxxxxxxxxxxxxf4k31337k3yxxxxxxxxxxxxxxxx' })
      ).to.be.rejectedWith(DidClient.DIDNotFoundError);
    });
  });

  context('with a valid DID id', function(){
    beforeEach(async function(){
      const rootEntity = await this.DidClient.register();
      Object.assign(this, { rootEntity });
    });

    it('should return the history of the DID', async function() {
      const { DidClient, rootEntity } = this;

      expect(
        await await DidClient.history({ did: rootEntity.did })
      ).to.matchPattern([
        {
          valid: _.isString, //"2019-01-08T18:03:41Z"
          did: {
            '@context': DidClient.getConfig().contextUrl,
            created: _.isString, //"2019-01-08T18:03:41.762Z"
            id: rootEntity.did,
            publicKey: [
              {
                id: `${rootEntity.did}#signing`,
                owner: rootEntity.did,
                publicKeyBase64: rootEntity.signingPublicKey,
                type: 'ed25519',
              },
              {
                id: `${rootEntity.did}#encrypting`,
                owner: rootEntity.did,
                publicKeyBase64: rootEntity.encryptingPublicKey,
                type: 'curve25519',
              }
            ]
          }
        }
      ]);

      const entities = [ rootEntity ];
      for(let n = 4; n !== 0; n--){
        entities.unshift(
          await this.DidClient.supersede({ entity: entities[0] })
        );
      }
      const latestEntity = entities[0];

      expect(
        await DidClient.history({ did: entities[0].did })
      ).to.matchPattern(
        entities.map(entity => ({
          superseded: entity === latestEntity ? undefined : _.isString, // TODO _.isDateString
          valid: entity === latestEntity ? _.isString : undefined, // TODO _.isDateString
          did: {
            '@context': DidClient.getConfig().contextUrl,
            created: _.isString,
            id: entity.did,
            publicKey: [
              {
                id: `${entity.did}#signing`,
                owner: entity.did,
                publicKeyBase64: entity.signingPublicKey,
                type: 'ed25519'
              },
              {
                id: `${entity.did}#encrypting`,
                owner: entity.did,
                publicKeyBase64: entity.encryptingPublicKey,
                type: 'curve25519',
              },
            ],
          }
        })).reverse()
      );

    });
  });

});
