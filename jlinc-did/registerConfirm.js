'use strict';

const sodium = require('sodium').api;
const b64 = require('urlsafe-base64');
const jwt = require('jsonwebtoken');

module.exports = async function registerConfirm({ did, registrationSecret, challenge, keys }) {

  if (!did) throw new Error('did is required');
  if (!registrationSecret) throw new Error('registrationSecret is required');
  if (!challenge) throw new Error('challenge is required');
  if (!keys) throw new Error('keys is required');

  // sign the challenge
  let signature;
  try {
    signature = sodium.crypto_sign_detached(
      sodium.crypto_hash_sha256(Buffer.from(challenge)),
      b64.decode(keys.signingPrivateKey),
    );
  }catch(error){
    throw new Error(`failed to sign challenge: ${error}`);
  }

  //create the JWT
  let token;
  try {
    token = jwt.sign(
      {
        id: did,
        signature: b64.encode(signature)
      },
      registrationSecret,
      {
        algorithm: 'HS256'
      },
    );
  }catch(error){
    throw new Error(`failed to sign json web token: ${error}`);
  }

  await this.request({
    method: 'post',
    path:  '/confirm',
    body: { challengeResponse: token },
  });

  return {
    ...keys,
    did,
    registrationSecret,
  };
};
