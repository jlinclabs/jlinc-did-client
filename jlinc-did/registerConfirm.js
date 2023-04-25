'use strict';

const b64 = require('urlsafe-base64');
const jwt = require('jsonwebtoken');

const signHash = require('./signHash');

module.exports = async function registerConfirm({ did, registrationSecret, challenge, keys }) {

  if (!did) throw new Error('did is required');
  if (!registrationSecret) throw new Error('registrationSecret is required');
  if (!challenge) throw new Error('challenge is required');
  if (!keys) throw new Error('keys is required');

  // sign the challenge
  let signature;
  try {
    signature = signHash(challenge, keys.signingPrivateKey);
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

  try{
    await this.request({
      method: 'post',
      path:  '/confirm',
      body: { challengeResponse: token },
    });
  }catch(error){
    if (error.message.includes('JWT-signature is invalid'))
      throw new Error(`invalid registrationSecret`);
    if (error.message.includes('signature does not verify'))
      throw new Error(`invalid keys or challenge`);
    throw error;
  }

  return {
    ...keys,
    did,
    registrationSecret,
  };
};
