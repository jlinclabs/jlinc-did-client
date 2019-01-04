'use strict';

const withDidServer = require('../helpers/withDidServer');

describe('jlincDid.supersede', function() {
  withDidServer();

  context('whe given an invalid arguments', function() {
    it('should throw an error', async function() {
      await expect(
        this.didClient.supersede({})
      ).to.be.rejectedWith('entity is required');
    });
  });

  context('whe given keys', function() {
    it('should use theo keys', async function() {
      const { didClient } = this;

      const entityOne = await didClient.register();
      expect(entityOne).to.be.anEntity();

      const keys = didClient.createKeys();
      const entityTwo = await didClient.supersede({ entity: entityOne, keys });
      expect(entityTwo).to.be.anEntity();
      expect(entityTwo.signingPublicKey).to.equal(keys.signingPublicKey);
      expect(entityTwo.signingPrivateKey).to.equal(keys.signingPrivateKey);
      expect(entityTwo.encryptingPublicKey).to.equal(keys.encryptingPublicKey);
      expect(entityTwo.encryptingPrivateKey).to.equal(keys.encryptingPrivateKey);
    });
  });


  it('should allow multiple supersedings', async function() {
    const { didClient } = this;

    const entityOne = await didClient.register();
    expect(entityOne).to.be.anEntity();

    expect(
      (await didClient.resolve({ did: entityOne.did })).id
    ).to.equal(entityOne.did);

    const entityTwo = await didClient.supersede({ entity: entityOne });
    expect(entityTwo).to.be.anEntity();
    expect(entityTwo.did).to.not.equal(entityOne.did);
    expect(entityTwo.registrationSecret).to.equal(entityOne.registrationSecret);

    expect(
      (await didClient.resolve({ did: entityOne.did })).id
    ).to.equal(entityTwo.did);

    expect(
      (await didClient.resolve({ did: entityTwo.did })).id
    ).to.equal(entityTwo.did);

    const entityThree = await didClient.supersede({ entity: entityTwo });
    expect(entityThree).to.be.anEntity();
    expect(entityThree.did).to.not.equal(entityOne.did);
    expect(entityThree.did).to.not.equal(entityTwo.did);
    expect(entityThree.registrationSecret).to.equal(entityOne.registrationSecret);

    expect(
      (await didClient.resolve({ did: entityOne.did })).id
    ).to.equal(entityThree.did);

    expect(
      (await didClient.resolve({ did: entityTwo.did })).id
    ).to.equal(entityThree.did);

    expect(
      (await didClient.resolve({ did: entityThree.did })).id
    ).to.equal(entityThree.did);
  });

});
