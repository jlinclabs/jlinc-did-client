'use strict';

const withDidServer = require('../helpers/withDidServer');

describe('registering a new DID', function() {
  withDidServer();

  it('request and confirm a new DID', async function() {
    const newEntity = await this.didClient.createEntity();
    const response = await this.didClient.registerRequest(newEntity);
    expect(response.status).to.equal(200);
    const { entity, confirmable } = response;
    expect(entity).to.be.aDidEntity();
    expect(confirmable.challenge).to.be.aRegistrationSecret();
    expect(confirmable.id).to.be.aValidJlincDidId();

    expect(
      await this.didClient.registerConfirm(entity, confirmable)
    ).to.matchPattern({
      success: true,
      id: confirmable.id,
    });
  });
});
