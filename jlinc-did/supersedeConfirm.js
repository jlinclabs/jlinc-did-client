'use strict';

const jwt = require('jsonwebtoken');

const signHash = require('./signHash');

module.exports = async function supersedeConfirm({ entity, keys, newDid, challenge }) {
  if (!entity) throw new Error('entity is required');
  if (!entity.registrationSecret) throw new Error('entity.registrationSecret is required');
  if (!keys) throw new Error('keys is required');
  if (!keys.signingPrivateKey) throw new Error('keys.signingPrivateKey is required');
  if (!newDid) throw new Error('newDid is required');
  if (!challenge) throw new Error('challenge is required');

  const signature = signHash(challenge, keys.signingPrivateKey);

  const challengeResponse = jwt.sign(
    { id: newDid, signature },
    entity.registrationSecret,
    {algorithm: 'HS256'}
  );

  const response = await this.request({
    method: 'post',
    path: '/confirmSupersede',
    body: { challengeResponse },
  });

  if (response.id !== newDid)
    throw new Error('unexpected response from server');

  return {
    ...keys,
    did: newDid,
    registrationSecret: entity.registrationSecret,
  };
};

