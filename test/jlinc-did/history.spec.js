'use strict';

const withDidServer = require('../helpers/withDidServer');

describe('jlincDid.history', function() {
  withDidServer();

  context('whe given an invalid did', function() {
    it('should throw an error', async function() {
      const { didClient } = this;
      await expect(
        didClient.history({ did: 'did:jlinc:xxxxxxxxxxxxxxxf4k31337k3yxxxxxxxxxxxxxxxx' })
      ).to.be.rejectedWith(didClient.DIDNotFoundError);
    });
  });

  context('with a valid DID id', function(){
    beforeEach(async function(){
      const rootEntity = await this.didClient.register();
      Object.assign(this, { rootEntity });
    });

    it('should return the history of the DID', async function() {
      const { didClient, rootEntity } = this;
      //       rootEntity:  {
      //   signingPublicKey: 'hyTR_rHG5s2qY03OvQrsKxJYJVpmdjUJ4egTxtV-1pg',
      //   signingPrivateKey: 'dBX7VsG6-7k65n4kSt5bbfRX4WZc9myJrEo27qSDS8aHJNH-scbmzapjTc69CuwrElglWmZ2NQnh6BPG1X7WmA',
      //   encryptingPublicKey: '5iPprEnUM6Qg3LEE_7_wbTMzadheUdleDqhRBJaQkHk',
      //   encryptingPrivateKey: 'IGnXcw__ar8SP6hsx81DYTdD9Q8TquXIZiwK5twERtA',
      //   did: 'did:jlinc:hyTR_rHG5s2qY03OvQrsKxJYJVpmdjUJ4egTxtV-1pg',
      //   registrationSecret: 'e0866fc30b06033e2184f2a9f8248fba5c0063fb80680e0faf1f680cfe8f10fa'
      // }
      expect(
        await await didClient.history({ did: rootEntity.did })
      ).to.matchPattern([
        {
          valid: _.isString, //"2019-01-08T18:03:41Z"
          did: {
            '@context': didClient.contextUrl,
            created: _.isString, //"2019-01-08T18:03:41.762Z"
            id: rootEntity.did,
            publicKey: [
              {
                id: `${rootEntity.did}#signing`,
                controller: rootEntity.did,
                publicKeyBase58: didClient.b58.b64tob58(rootEntity.signingPublicKey),
                type: 'Ed25519VerificationKey2018'
              },
              {
                id: `${rootEntity.did}#encrypting`,
                controller: rootEntity.did,
                publicKeyBase58: didClient.b58.b64tob58(rootEntity.encryptingPublicKey),
                type: 'X25519KeyAgreementKey2019',
              },
            ]
          }
        }
      ]);

      const entities = [ rootEntity ];
      for(let n = 4; n !== 0; n--){
        entities.unshift(
          await this.didClient.supersede({ entity: entities[0] })
        );
      }
      const latestEntity = entities[0];

      expect(
        await didClient.history({ did: entities[0].did })
      ).to.matchPattern(
        entities.map(entity => ({
          superseded: entity === latestEntity ? undefined : _.isString, // TODO _.isDateString
          valid: entity === latestEntity ? _.isString : undefined, // TODO _.isDateString
          did: {
            '@context': didClient.contextUrl,
            created: _.isString,
            id: entity.did,
            publicKey: [
              {
                id: `${entity.did}#signing`,
                controller: entity.did,
                publicKeyBase58: didClient.b58.b64tob58(entity.signingPublicKey),
                type: 'Ed25519VerificationKey2018'
              },
              {
                id: `${entity.did}#encrypting`,
                controller: entity.did,
                publicKeyBase58: didClient.b58.b64tob58(entity.encryptingPublicKey),
                type: 'X25519KeyAgreementKey2019',
              },
            ],
          }
        })).reverse()
      );

    });
  });

});
