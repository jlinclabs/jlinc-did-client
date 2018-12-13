'use strict';

const request = require('../../lib/request');
const spawn = require('child_process').spawn;
const exec = require('child-process-promise').exec;
const didClient = require('../../jlinc-did');

const didServerHelpers = {

  didClient,

  async registerDid() {
    const response = await didClient.registerRequest();
    if (response.error) throw new Error(`error registering did ${response.error}`);
    const { entity, confirmable } = await didClient.registerRequest();
    await didClient.registerConfirm(entity, confirmable);
    Object.assign(this, {
      didId: confirmable.id,
      entity,
    });
  },
};

let didServerProcess;
module.exports = function withDidServer(){
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
