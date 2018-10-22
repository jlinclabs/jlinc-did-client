'use strict';

class CustomError extends Error {
  constructor(message){
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
};

module.exports =  {
  version: require('../package.json').version,
  contextUrl: 'https://w3id.org/did/v1',

  // Custom Errors
  EncryptError: class EncryptError extends CustomError {},
  DecryptError: class DecryptError extends CustomError {},

  // utilities
  registerRequest: require('./registerRequest'),
};
