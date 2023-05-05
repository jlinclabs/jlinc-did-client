'use strict';

const URL = require('url');
const axios = require('axios');

module.exports = async function ({ method, path, body }) {
  const stack = (new Error).stack;
  const { RequestError, ResourceNotFoundError } = this;

  if (!method) throw new Error(`method is required`);
  if (!path) throw new Error(`path is required`);

  // Handle legacy configuration of didServerUrl
  if (!this.getConfig().didServerUrl && this.didServerUrl)
    this.setConfig({
      didServerUrl: this.didServerUrl,
    });
  // End legacy block

  if (!this.getConfig().didServerUrl) throw new Error(`You must set didServerUrl via setConfig()`);
  const url = URL.resolve(this.getConfig().didServerUrl, URL.resolve('/', path));

  const validMethods = [
    'request',
    'get',
    'delete',
    'head',
    'options',
    'post',
    'put',
    'patch',
  ];
  if (validMethods.indexOf(method) < 0) throw new Error(`method is invalid`);

  let response;
  try {
    response = await axios.request({
      method,
      url,
      data: body,
      responseType: 'json',
    });
  } catch (e) {
    response = e.response;
  }

  if (response.status === 404){
    throw new ResourceNotFoundError(`Resource Not Found: method=${method} path=${path}`);
  }

  if (
    response.status < 200 ||
    response.status >= 300 ||
    (response.data && response.data.error)
  ) {
    const errorMessage = (response.data && response.data.error) ||
      `statusCode=${response.status} method=${method} path=${path}`;
    const error = new RequestError(`RequestError: "${errorMessage}"`);
    error.stack += stack;
    throw error;
  }

  return response.data;
};
