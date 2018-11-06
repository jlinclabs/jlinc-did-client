'use strict';

// const sodium = require('sodium').api;
// const b64 = require('urlsafe-base64');
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
    console.log(did);
    let response = await request(options);
    if (response.statusCode === 200) {
      return {success: true, status: response.statusCode, entity, confirmable: response.body};
    } else {
      return {success: false, status: response.statusCode, entity, error: response.body.error};
    }
  } catch (e) {
    return e.message;
  }



  // return {entity, confirmable(object to send to /confirm)}
};
