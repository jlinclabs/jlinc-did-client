'use strict';

const jwt = require('jsonwebtoken');
const request = require('request-promise');

module.exports = async function revokeDID(id, registrationSecret) {
  const url = this.Conf.didServerUrl;
  const payload = {id};

  //create the JWT
  let token;
  try {
    token = jwt.sign(payload, registrationSecret, {algorithm: 'HS256'});
  } catch (e) {
    return e.message;
  }
  console.log(JSON.stringify({revokeRequest: token})); // eslint-disable-line
  try {
    let options = {
      method: 'POST',
      uri: `${url}revoke`,
      body: {revokeRequest: token},
      json: true,
      resolveWithFullResponse: true,
      simple: false
    };

    let response = await request(options);
    if (response.statusCode === 200) {
      return {success: true, revoked: response.body.revoked};
    } else {
      return {success: false, status: response.statusCode, id, error: response.body.error};
    }
  } catch (e) {
    return e.message;
  }

};
