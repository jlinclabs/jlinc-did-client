'use strict';

const URL = require('url');
const request = require('request-promise');

module.exports = async function({ method, path, body, followRedirect }){
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

  if (!(method in request)) throw new Error(`method is invalid`);

  const requestOptions = {
    method,
    url,
    body,
    json: true,
    resolveWithFullResponse: true,
    simple: false,
    followRedirect,
  };

  const response = await request[method](requestOptions);

  if (response.statusCode === 404){
    throw new ResourceNotFoundError(`Resource Not Found: method=${method} path=${path}`);
  }

  if (
    response.statusCode < 200 ||
    response.statusCode >= 300 ||
    (response.body && response.body.error)
  ) {
    const errorMessage = (response.body && response.body.error) ||
      `statusCode=${response.statusCode} method=${method} path=${path}`;
    const error = new RequestError(`RequestError: "${errorMessage}"`);
    error.stack += stack;
    throw error;
  }

  return response.body;
};
