'use strict';

const request = require('request-promise');
const jwt = require('jsonwebtoken');
/*************************************************************
Requires out-of-band agentkey and agentsecret registration
**************************************************************/
const agentkey = process.env.agentkey;
const agentsecret = process.env.agentsecret;


module.exports = async function registerRequest() {
  const {MasterPublicKeyError, CreateRegistrantSecretError} = this;
  let registration;

  // get the DID server's public key unless we've already cached it
  let serverPublicKey;
  let url = this.didServerUrl;
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
  let registrationObj = this.createDID(entity);

  try {
    registrationObj.secret = this.createRegistrantSecret(entity, serverPublicKey);
  } catch (e) {
    throw new CreateRegistrantSecretError(e.message);
  }

  // preserve the structure of the did
  let didID = registrationObj.did.id;
  registrationObj.did = JSON.stringify(registrationObj.did);

  //create the JWT
  try {
    registration = jwt.sign(registrationObj, agentsecret, {algorithm: 'HS256'});
  } catch (e) {
    return e.message;
  }

  let agentRegistration = {agentkey, registration};

  try {
    let options = {
      method: 'POST',
      uri: `${url}agentRegister`,
      body: agentRegistration,
      json: true,
      resolveWithFullResponse: true,
      simple: false
    };

    let response = await request(options);
    if (response.statusCode === 201) {
      return {success: true, id: response.body.id};
    } else {
      return {success: false, status: response.statusCode, id: didID, error: response.body.error};
    }
  } catch (e) {
    return e.message;
  }

};
