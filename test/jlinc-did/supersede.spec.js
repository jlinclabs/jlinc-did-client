'use strict';

const withDidServer = require('../helpers/withDidServer');

describe('jlincDid.supersede', function() {
  withDidServer();

  context('whe given an invalid arguments', function() {
    it('should throw an error', async function() {
      await expect(
        this.DidClient.supersede({})
      ).to.be.rejectedWith('entity is required');
    });
  });

  context('whe given keys', function() {
    it('should use theo keys', async function() {
      const { DidClient } = this;

      const entityOne = await DidClient.register();
      expect(entityOne).to.be.anEntity();

      const keys = DidClient.createKeys();
      const entityTwo = await DidClient.supersede({ entity: entityOne, keys });
      expect(entityTwo).to.be.anEntity();
      expect(entityTwo.signingPublicKey).to.equal(keys.signingPublicKey);
      expect(entityTwo.signingPrivateKey).to.equal(keys.signingPrivateKey);
      expect(entityTwo.encryptingPublicKey).to.equal(keys.encryptingPublicKey);
      expect(entityTwo.encryptingPrivateKey).to.equal(keys.encryptingPrivateKey);
    });
  });


  it('should allow multiple supersedings', async function() {
    const { DidClient } = this;

    const entityOne = await DidClient.register();
    expect(entityOne).to.be.anEntity();

    expect(
      (await DidClient.resolve({ did: entityOne.did })).id
    ).to.equal(entityOne.did);

    const entityTwo = await DidClient.supersede({ entity: entityOne });
    expect(entityTwo).to.be.anEntity();
    expect(entityTwo.did).to.not.equal(entityOne.did);
    expect(entityTwo.registrationSecret).to.equal(entityOne.registrationSecret);

    expect(
      (await DidClient.resolve({ did: entityOne.did })).id
    ).to.equal(entityTwo.did);

    expect(
      (await DidClient.resolve({ did: entityTwo.did })).id
    ).to.equal(entityTwo.did);

    const entityThree = await DidClient.supersede({ entity: entityTwo });
    expect(entityThree).to.be.anEntity();
    expect(entityThree.did).to.not.equal(entityOne.did);
    expect(entityThree.did).to.not.equal(entityTwo.did);
    expect(entityThree.registrationSecret).to.equal(entityOne.registrationSecret);

    expect(
      (await DidClient.resolve({ did: entityOne.did })).id
    ).to.equal(entityThree.did);

    expect(
      (await DidClient.resolve({ did: entityTwo.did })).id
    ).to.equal(entityThree.did);

    expect(
      (await DidClient.resolve({ did: entityThree.did })).id
    ).to.equal(entityThree.did);
  });

});
