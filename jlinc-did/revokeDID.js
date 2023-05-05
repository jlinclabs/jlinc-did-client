'use strict';

const jwt = require('jsonwebtoken');
const axios = require('axios');

module.exports = async function revokeDID(id, registrationSecret) {
  const url = this.getConfig().didServerUrl;
  const payload = { id };

  //create the JWT
  let token;
  try {
    token = jwt.sign(payload, registrationSecret, { algorithm: 'HS256' });
  } catch (e) {
    return e.message;
  }

  try {
    let response = await axios({
      method: 'POST',
      url: `${url}revoke`,
      data: { revokeRequest: token },
      responseType: 'json',
    });
    if (response.status === 200) {
      return { success: true, revoked: response.data.revoked };
    } else {
      return { success: false, status: response.status, id, error: response.status };
    }
  } catch (e) {
    return e.message;
  }

};
