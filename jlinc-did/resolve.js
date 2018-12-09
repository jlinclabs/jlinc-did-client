'use strict';

const request = require('request-promise');

module.exports = async function resolve(id, root) {
  const url = this.Conf.didServerUrl;

  //boolean root, if true, indicates a request to get the most current ID
  //in the same root chain as the requested ID
  if (root) {
    try {
      let options = {
        method: 'Get',
        uri: `${url}root/${id}`,
        json: true,
        resolveWithFullResponse: true,
        simple: false
      };

      let response = await request(options);
      if (response.statusCode === 200) {
        return {success: true, resolved: response.body};
      } else {
        return {success: false, status: response.statusCode, id, error: response.body.error};
      }
    } catch (e) {
      return e.message;
    }
  } else {
    try {
      let options = {
        method: 'Get',
        uri: `${url}${id}`,
        json: true,
        resolveWithFullResponse: true,
        simple: false
      };

      let response = await request(options);
      if (response.statusCode === 200) {
        return {success: true, resolved: response.body};
      } else {
        return {success: false, status: response.statusCode, id, error: response.body.error};
      }
    } catch (e) {
      return e.message;
    }
  }
};
