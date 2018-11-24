'use strict';

module.exports = function createDID(entity) {
  let did = {
    '@context': this.Conf.contextUrl,
    id: `did:jlinc:${entity.signingPublicKey}`,
    created: new Date().toISOString()
  };
  let publicKey = [{
    id: `${did.id}#signing`,
    type: 'ed25519',
    owner: did.id,
    publicKeyBase64: entity.signingPublicKey
  },
  {
    id: `${did.id}#encrypting`,
    type: 'curve25519',
    owner: did.id,
    publicKeyBase64: entity.encryptingPublicKey
  }];
  did.publicKey = publicKey;

  let signature = this.signDID(did, entity);
  return {did, signature};
};
