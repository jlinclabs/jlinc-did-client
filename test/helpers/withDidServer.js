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

module.exports = function withDidServer(){
  let didServerProcess;

  before(async function() {
    Object.assign(this, didServerHelpers);
    didServerProcess = spawn('./scripts/didserver-start');
    await tryForXMiliseconds(isDidServerRunning);
  });

  beforeEach(async function(){
    await exec('./scripts/didserver-db-reset');
  });

  after(function() {
    didServerProcess.kill();
  });

  async function isDidServerRunning() {
    const response = await request.get('http://localhost:5001');
    if (!response) throw Error('DID server not responding');
    const masterPublicKey = JSON.parse(response).masterPublicKey;
    if (masterPublicKey === 'aPublicKey') {
      throw new Error('Please add a valid public key to your didserver config.toml');
    }
  }

  async function tryForXMiliseconds(functionToTry, timeLimit = 400) {
    const initialTime = new Date();
    const initialMs = initialTime.getTime();

    const trier = async function(){
      try {
        return await functionToTry();
      } catch (error) {
        const tryTime = new Date();
        const tryMs = tryTime.getTime();
        if (tryMs - initialMs >= timeLimit) throw error;
        return await trier();
      }
    };
    return trier();
  }
};
