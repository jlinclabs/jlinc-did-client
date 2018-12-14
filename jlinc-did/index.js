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
  // didServerUrl: 'http://localhost:5001/',

  // Custom Errors
  MasterPublicKeyError: class MasterPublicKeyError extends CustomError {},
  CreateRegistrantSecretError: class CreateRegistrantSecretError extends CustomError {},

  // resolving DIDs
  resolve: require('./resolve'),
  history: require('./history'),

  // registering a new entity
  registerRequest: require('./registerRequest'),
  registerConfirm: require('./registerConfirm'),

  // registration
  getMasterPublicKey: require('./getMasterPublicKey'),
  createEntity: require('./createEntity'),
  createDID: require('./createDID'),
  createNonce: require('./createNonce'),
  signDID: require('./signDID'),
  createRegistrantSecret: require('./createRegistrantSecret'),

  // supersede
  supersedeRequest: require('./supersedeRequest'),
  supersedeConfirm: require('./supersedeConfirm'),

  // revoke
  revokeDID: require('./revokeDID'),
};
