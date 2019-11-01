'use strict';

const sodium = require('sodium').api;
const b64 = require('urlsafe-base64');
const jsonwebtoken = require('jsonwebtoken');

const withDidServer = require('../helpers/withDidServer');
const withSinon = require('../helpers/withSinon');

describe('jlincDid.registerConfirm', function() {
  withDidServer();
  withSinon();

  context('when given invalid arguments', function(){
    it('should throw an error', async function(){
      await expect(
        this.didClient.registerConfirm()
      ).to.be.rejected;

      await expect(
        this.didClient.registerConfirm({})
      ).to.be.rejectedWith('did is required');

      await expect(
        this.didClient.registerConfirm({
          did: 'xxx',
        })
      ).to.be.rejectedWith('registrationSecret is required');

      await expect(
        this.didClient.registerConfirm({
          did: 'xxx',
          registrationSecret: 'yyyy',
        })
      ).to.be.rejectedWith('challenge is required');

      await expect(
        this.didClient.registerConfirm({
          did: 'xxx',
          registrationSecret: 'yyyy',
          challenge: 'pppp',
        })
      ).to.be.rejectedWith('keys is required');

      await expect(
        this.didClient.registerConfirm({
          did: 'xxx',
          registrationSecret: 'yyyy',
          challenge: 'pppp',
          keys: 'kkkkkk',
        })
      ).to.be.rejectedWith('failed to sign challenge');
    });
  });

  context('when given valid arguments', function(){
    it('should send a request to the did server', async function(){

      this.sinon.stub(this.didClient, 'request');

      const keys = this.didClient.createKeys();
      const did = `did:jlinc:${keys.signingPublicKey}`;
      const registrationSecret = createRegistrationSecret();
      const challenge = createRegistrationSecret();

      const entity = await this.didClient.registerConfirm({
        did, registrationSecret, challenge, keys,
      });

      expect(entity).to.deep.equal({
        did,
        ...keys,
        registrationSecret,
      });

      expect(this.didClient.request).to.have.been.calledOnce;
      const options = this.didClient.request.args[0][0];
      expect(options.method).to.equal('post');
      expect(options.path).to.equal('/confirm');
      expect(options.body).to.have.all.keys('challengeResponse');
      expect(options.body.challengeResponse).to.be.aJwtSignedWith(registrationSecret);
      const decodedJwt = jsonwebtoken.decode(options.body.challengeResponse);
      expect(decodedJwt).to.have.all.keys('id', 'signature', 'iat');
      expect(decodedJwt.id).to.equal(did);
      expect(decodedJwt.signature).to.be.a('string');
      expect(decodedJwt.signature).to.have.lengthOf(86);
      expect(
        sodium.crypto_sign_verify_detached(
          b64.decode(decodedJwt.signature),
          sodium.crypto_hash_sha256(Buffer.from(challenge)),
          b64.decode(keys.signingPublicKey)
        )
      ).to.be.true;
    });
  });

  context('when given an invalid registrationSecret', function(){
    it('should throw an error', async function(){
      const keys = this.didClient.createKeys();
      const { did, challenge }
        = await this.didClient.registerRequest({ keys });
      const registrationSecret = createRegistrationSecret();

      await expect(
        this.didClient.registerConfirm({
          did, registrationSecret, challenge, keys,
        })
      ).to.be.rejectedWith('invalid registrationSecret');
    });
  });
  context('when given an invalid challenge', function(){
    it('should throw an error', async function(){
      const keys = this.didClient.createKeys();
      const { did, registrationSecret }
        = await this.didClient.registerRequest({ keys });
      const challenge = createRegistrationSecret();

      await expect(
        this.didClient.registerConfirm({
          did, registrationSecret, challenge, keys,
        })
      ).to.be.rejectedWith('invalid keys or challenge');
    });
  });

  context('when given an entity that does match the challenge', function(){
    it('should not throw an error', async function(){
      const keys = this.didClient.createKeys();
      const { did, registrationSecret, challenge }
        = await this.didClient.registerRequest({ keys });

      const entity = await this.didClient.registerConfirm({
        did, registrationSecret, challenge, keys,
      });

      expect(entity).to.deep.equal({
        did,
        ...keys,
        registrationSecret,
      });

    });
  });
});


function createRegistrationSecret(){
  const buffer = Buffer.alloc(32);
  sodium.randombytes(buffer);
  return buffer.toString('hex');
}
