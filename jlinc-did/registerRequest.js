'use strict';

// const sodium = require('sodium').api;
// const b64 = require('urlsafe-base64');
const request = require('request-promise');

module.exports = async function registerRequest() {
  // get the DID server's public key unless we've already cached it
  let serverPublicKey;
  let url = this.Conf.didServerUrl;
  if (process.env.serverPublicKey) {
    serverPublicKey = process.env.serverPublicKey;
  } else {
    let response = await request.get({url});
    serverPublicKey = JSON.parse(response).masterPublicKey;
    process.env.serverPublicKey = serverPublicKey;
  }

  // create the DID registration request
  let entity = this.createEntity();
  let did = this.createDID(entity);
  did.secret = this.createRegistrantSecret(entity, serverPublicKey);

  return did;
};
