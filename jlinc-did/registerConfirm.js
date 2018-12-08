'use strict';

const sodium = require('sodium').api;
const b64 = require('urlsafe-base64');
const jwt = require('jsonwebtoken');
const request = require('request-promise');

module.exports = async function registerConfirm(entity, confirmable) {
  const url = this.Conf.didServerUrl;
  const didID = confirmable.id;
  const challenge = confirmable.challenge;
  let signature;
  let token;

  // sign the challenge
  try {
    let hash = sodium.crypto_hash_sha256(Buffer.from(challenge));
    signature = sodium.crypto_sign_detached(hash, b64.decode(entity.signingPrivateKey));
  } catch (e) {
    return e.message;
  }

  //create the JWT
  try {
    token = jwt.sign({id: didID, signature: b64.encode(signature)}, entity.registrationSecret, {algorithm: 'HS256'});
  } catch (e) {
    return e.message;
  }

  try {
    let options = {
      method: 'POST',
      uri: `${url}confirm`,
      body: {challengeResponse: token},
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