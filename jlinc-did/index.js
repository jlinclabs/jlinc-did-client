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
  getMasterPublicKey: require('./getMasterPublicKey'),
  createEntity: require('./createEntity'),
  createDID: require('./createDID'),
  createNonce: require('./createNonce'),
  signDID: require('./signDID'),
  createRegistrantSecret: require('./createRegistrantSecret'),
};
