'use strict';

const request = require('../../lib/request');
const spawn = require('child_process').spawn;
const exec = require('child-process-promise').exec;

let didServerProcess;
module.exports = function withDidServer(){

  before(async function() {
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
