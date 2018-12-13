'use strict';

const withDidServer = require('../helpers/withDidServer');

describe('registering a new DID', function() {
  withDidServer();

  it('request and confirm a new DID', async function() {
    let response = await this.didClient.registerRequest();
    expect(response.status).to.equal(200);
    const { entity, confirmable } = response;
    expect(entity).to.be.aDidEntity();
    expect(confirmable.challenge).to.be.aRegistrationSecret();
    expect({
      jlincDidId: confirmable.id,
      signingPublicKey: entity.signingPublicKey,
    }).to.be.aValidJlincDidId();

    response = await this.didClient.registerConfirm(entity, confirmable);
    expect(response.success).to.be.true;
    expect(response.id).to.equal(confirmable.id);
  });

});
