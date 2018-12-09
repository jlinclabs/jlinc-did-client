'use strict';

const request = require('request-promise');

module.exports = async function history(id) {
  const url = this.Conf.didServerUrl;

  try {
    let options = {
      method: 'Get',
      uri: `${url}history/${id}`,
      json: true,
      resolveWithFullResponse: true,
      simple: false
    };

    let response = await request(options);
    if (response.statusCode === 200) {
      return {success: true, history: response.body.history};
    } else {
      return {success: false, status: response.statusCode, id, error: response.body.error};
    }
  } catch (e) {
    return e.message;
  }
};
