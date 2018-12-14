'use strict';

const request = require('../../lib/request');
const spawn = require('child_process').spawn;
const exec = require('child-process-promise').exec;
const didClient = require('../../jlinc-did');

const didServerHelpers = {

  didClient,

  async registerDid() {
    let response = await didClient.registerRequest();
    if (response.error) throw new Error(`error in registerRequest: ${response.error}`);
    const { entity, confirmable } = response;
    response = await didClient.registerConfirm(entity, confirmable);
    if (response.error) throw new Error(`error in registerConfirm: ${response.error}`);
    return { confirmable, entity };
  },

  async supersedeDid({didId, registrationSecret}) {
    let response = await didClient.supersedeRequest(didId);
    if (response.error) throw new Error(`error in supersedeRequest: ${error}`);
    const { entity, confirmable } = response;
    response = await didClient.supersedeConfirm(entity, confirmable, registrationSecret);
    if (response.error) throw new Error(`error in supersedeConfirm: ${error}`);
    Object.assign(this, {
      latestDidId: confirmable.id,
      latestEntity: entity,
    });
  },
};


async function getDidServerIndex() {
  return await request.get('http://localhost:5001');
}

async function expectDidServerToHaveValidKeys(){
  const response = await getDidServerIndex();
  const masterPublicKey = JSON.parse(response).masterPublicKey;
  if (masterPublicKey === 'aPublicKey') {
    throw new Error('Invalid config.toml !!! Please add a valid public key to your didserver config.toml');
  }
}

const now = () => (new Date()).getTime();

async function tryForXMilliseconds(functionToTry, timeLimit = 400) {
  const start = now();
  const trier = async function(){
    try {
      return await functionToTry();
    } catch (error) {
      const timeElapsed = now() - start;
      if (timeElapsed >= timeLimit) throw error;
      return await trier();
    }
  };
  return await trier();
}

module.exports = function withDidServer(){
  let didServerProcess;

  before(async function() {
    Object.assign(this, didServerHelpers);
    didServerProcess = spawn('./scripts/didserver-start');
    await tryForXMilliseconds(getDidServerIndex);
    await expectDidServerToHaveValidKeys();
  });

  beforeEach(async function(){
    await exec('./scripts/didserver-db-reset');
  });

  after(function() {
    didServerProcess.kill();
  });

};
