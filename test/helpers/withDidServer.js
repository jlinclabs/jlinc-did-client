'use strict';

const path = require('path');
const request = require('request-promise');
const { spawn, execSync } = require('child_process');
const didClient = require('../../jlinc-did');

const didServerHelpers = {

  async getDidServerIndex() {
    return await didServer.request('get', '/');
  },

  didClient,

  async registerDid() {
    const newEntity = didClient.createEntity();
    let response = await didClient.registerRequest(newEntity);
    if (response.error) throw new Error(`error in registerRequest: ${response.error}`);
    const { entity, confirmable } = response;
    response = await didClient.registerConfirm(entity, confirmable);
    if (response.error) throw new Error(`error in registerConfirm: ${response.error}`);
    return { didId: confirmable.id, entity };
  },

  async supersedeDid({didId, registrationSecret}) {
    let response = await didClient.supersedeRequest(didId);
    if (response.error) throw new Error(`error in supersedeRequest: ${error}`);
    const { entity, confirmable } = response;
    response = await didClient.supersedeConfirm(entity, confirmable, registrationSecret);
    if (response.error) throw new Error(`error in supersedeConfirm: ${error}`);
    return {
      latestDidId: confirmable.id,
      latestEntity: entity,
    };
  },
};

module.exports = function withDidServer(){

  before(async function() {
    Object.assign(this, didServerHelpers);
    await didServer.start();
    didClient.didServerUrl = didServer.url+'/'; // FML
  });

  beforeEach(async function(){
    await didServer.reset();
  });

};

const didServer = {
  port: 3044,
  url: 'http://localhost:3044',
  db: 'jlinc_did_server_test',
  path: path.resolve(__dirname, '../../didserver'),

  execOptions(){
    return {
      shell: true,
      cwd: this.path,
      silent: true,
      // stdio: 'inherit',
      env: {
        DATABASE_URL: `postgres://root@localhost:26257/${this.db}?sslmode=disable`,
        URL: this.url,
        PORT: `${this.port}`,
        PUBLIC_KEY:  'xRliWWNCToxApYwfRFf8hIUf2x7E6sn2MmIfwAJzokI',
        PRIVATE_KEY: '8hwb4iOJ05LqzuhAi4r8sHccPh_HgkOd_ugbAGhZE74',
        CONTEXT: 'https://w3id.org/did/v1',
      },
    };
  },

  async setup(){
    execSync(`${this.path}/scripts/db-reset`, this.execOptions());
  },

  async start(){
    if (this.childProcess) return;
    await this.setup();
    this.childProcess = spawn(`${this.path}/scripts/start`, [], this.execOptions());
    await tryForXMilliseconds(() => this.getMasterPublicKey());
  },

  async reset(){
    // execSync(`${this.path}/scripts/db-reset`, this.execOptions());
    execSync(`
      cockroach sql --insecure --execute="SET database = ${this.db}; TRUNCATE didstore"
    `);
  },

  async stop(){
    if (this.childProcess) this.childProcess.kill('SIGINT');
  },

  async request(method, path){
    return await request.get({
      method,
      uri: `${this.url}${path}`,
      json: true,
    });
  },

  async getMasterPublicKey(){
    const { masterPublicKey } = await this.request('get', '/');
    return masterPublicKey;
  }
};

function onExit(){ didServer.stop(); }
process.on('exit', onExit);
process.on('SIGINT', onExit);
process.on('SIGUSR1', onExit);
process.on('SIGUSR2', onExit);

const now = () => (new Date()).getTime();

async function tryForXMilliseconds(functionToTry, timeLimit = 100) {
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
