'use strict';

const DidClient = require('./jlinc-did')

module.exports =  {
  version: require('./package.json').version,
  DidClient: DidClient,

  // Legacy support
  now: DidClient.now,
  contextUrl: DidClient.contextUrl,
  JlincDidError: DidClient.JlincDidError,
  RequestError: DidClient.RequestError,
  ResourceNotFoundError: DidClient.ResourceNotFoundError,
  ResolutionError: DidClient.ResolutionError,
  DIDNotFoundError: DidClient.DIDNotFoundError,
  EntityRegistrationError: DidClient.EntityRegistrationError,
  request: DidClient.request,
  getServerPublicKey: DidClient.getServerPublicKey,
  registerRequest: DidClient.registerRequest,
  registerConfirm: DidClient.registerConfirm,
  register: DidClient.register,
  createKeys: DidClient.createKeys,
  createDidDocument: DidClient.createDidDocument,
  createNonce: DidClient.createNonce,
  resolve: DidClient.resolve,
  history: DidClient.history,
  supersedeRequest: DidClient.supersedeRequest,
  supersedeConfirm: DidClient.supersedeConfirm,
  supersede: DidClient.supersede,
  revokeDID: DidClient.revokeDID,
};
