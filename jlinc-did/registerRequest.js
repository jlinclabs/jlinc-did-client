'use strict';

const request = require('request-promise');

module.exports = async function registerRequest() {
  const {MasterPublicKeyError, CreateRegistrantSecretError} = this;

  // get the DID server's public key unless we've already cached it
  let serverPublicKey;
  let url = this.Conf.didServerUrl;
  if (process.env.serverPublicKey) {
    serverPublicKey = process.env.serverPublicKey;
  } else {
    try {
      let response = await request.get({url});
      serverPublicKey = JSON.parse(response).masterPublicKey;
      process.env.serverPublicKey = serverPublicKey;
    } catch (e) {
      throw new MasterPublicKeyError(e.message);
    }
  }

  // create the DID registration request
  let entity = this.createEntity();
  let did = this.createDID(entity);

  try {
    did.secret = this.createRegistrantSecret(entity, serverPublicKey);
  } catch (e) {
    throw new CreateRegistrantSecretError(e.message);
  }

  try {
    let options = {
      method: 'POST',
      uri: `${url}register`,
      body: did,
      json: true,
      resolveWithFullResponse: true,
      simple: false
    };

    let response = await request(options);
    if (response.statusCode === 200) {
      return {success: true, status: response.statusCode, entity, confirmable: response.body};
    } else {
      return {success: false, status: response.statusCode, entity, error: response.body.error};
    }
  } catch (e) {
    return e.message;
  }

  /*
  **********************
  On success, the entity and confirmable values MUST be captured and persisted to be available
  for further operations, including formulating a POST to /confirm.

  The entity.signingPrivateKey, entity.encryptingPrivateKey and entity.registrationSecret values
  SHOULD be carefully protected for security.
  **********************
  */

};
