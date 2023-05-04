'use strict';

class JlincDidError extends Error {
  constructor(message){
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
};

module.exports =  {
  version: require('../package.json').version,

  now: require('./now'),

  // Config
  getConfig: require('./getConfig'),
  setConfig: require('./setConfig'),

  // Custom Errors
  JlincDidError,
  RequestError: class RequestError extends JlincDidError {},
  ResourceNotFoundError: class ResourceNotFoundError extends JlincDidError {},
  // CreateRegistrantSecretError: class CreateRegistrantSecretError extends JlincDidError {},
  ResolutionError: class ResolutionError extends JlincDidError {},
  DIDNotFoundError: class DIDNotFoundError extends JlincDidError {},
  EntityRegistrationError: class EntityRegistrationError extends JlincDidError {},

  request: require('./request'),
  getServerPublicKey: require('./getServerPublicKey'),

  // registering a new entity
  registerRequest: require('./registerRequest'),
  registerConfirm: require('./registerConfirm'),
  register: require('./register'),
  registerWithAgentKey: require('./registerWithAgentKey'),

  // registration
  createKeys: require('./createKeys'),
  createDidDocument: require('./createDidDocument'),
  createNonce: require('./createNonce'),
  // createRegistrantSecret: require('./createRegistrantSecret'),

  // resolving DIDs
  resolve: require('./resolve'),
  history: require('./history'),

  // supersede
  supersedeRequest: require('./supersedeRequest'),
  supersedeConfirm: require('./supersedeConfirm'),
  supersede: require('./supersede'),

  // revoke
  revokeDID: require('./revokeDID'),
};
