'use strict';

const URL = require('url');
const request = require('request-promise');

module.exports = async function({ method, path, body, followRedirect }){
  const { RequestError, ResourceNotFoundError } = this;

  if (!method) throw new Error(`method is required`);
  if (!path) throw new Error(`path is required`);

  if (!this.didServerUrl) throw new Error(`jlincDidClient.didServerUrl must be set`);
  const url = URL.resolve(this.didServerUrl, URL.resolve('/', path));

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
    throw new ResourceNotFoundError('request not found');
  }

  if (
    response.statusCode < 200 ||
    response.statusCode >= 300 ||
    (response.body && response.body.error)
  ) {
    const errorMessage = (response.body && response.body.error) ||
      `unknown request error statusCode: ${response.statusCode}`;
    throw new RequestError(`RequestError: ${errorMessage}`);
  }

  return response.body;
};
