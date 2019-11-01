'use strict';

const sodium = require('sodium').api;
const b64 = require('urlsafe-base64');

module.exports = async function registerRequest({ keys }) {
  if (!keys) throw new Error('keys is required');
  if (!keys.encryptingPrivateKey) throw new Error(`keys.encryptingPrivateKey is required`);

  const { didDocument, signature } = this.createDidDocument({ keys });

  const serverPublicKey = await this.getServerPublicKey();
  const registrationSecret = createRegistrationSecret();

  const response = await this.request({
    method: 'post',
    path: '/register',
    body: {
      did: didDocument,
      signature,
      secret: await createRegistrantSecret({
        serverPublicKey,
        registrationSecret,
        encryptingPrivateKey: keys.encryptingPrivateKey,
      }),
    },
  });

  if (!response.id) throw new Error(`expected id from did server`);
  if (!response.challenge) throw new Error(`expected challenge from did server`);
  const { id: did, challenge } = response;

  return { did, registrationSecret, challenge };
};

function createRegistrationSecret(){
  const buffer = Buffer.alloc(32);
  sodium.randombytes(buffer);
  return buffer.toString('hex');
}

function createRegistrantSecret({ serverPublicKey, registrationSecret, encryptingPrivateKey }) {
  const nonce = Buffer.alloc(sodium.crypto_box_NONCEBYTES);
  sodium.randombytes(nonce);

  const cyphertext = sodium.crypto_box(
    Buffer.from(registrationSecret),
    nonce,
    b64.decode(serverPublicKey),
    b64.decode(encryptingPrivateKey)
  );

  return {
    cyphertext: b64.encode(cyphertext),
    nonce: b64.encode(nonce),
  };
};
