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
  Conf: require('../config.json'),

  // Custom Errors
  EncryptError: class EncryptError extends CustomError {},
  DecryptError: class DecryptError extends CustomError {},

  // registering a new entity
  registerRequest: require('./registerRequest'),

  // utilities
  createEntity: require('./createEntity'),
};
