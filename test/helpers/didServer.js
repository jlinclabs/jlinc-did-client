'use strict';

const sodium = require('sodium-native');
const b64 = require('urlsafe-base64');
const jsonwebtoken = require('jsonwebtoken');
const bodyParser = require('body-parser');
const express = require('express');
const errorHandler = require('errorhandler');

const findOpenPort = require('./findOpenPort');
const { DidClient } = require('../..');

const PUBLIC_KEY = 'xRliWWNCToxApYwfRFf8hIUf2x7E6sn2MmIfwAJzokI';
const PRIVATE_KEY = '8hwb4iOJ05LqzuhAi4r8sHccPh_HgkOd_ugbAGhZE74';


const didServer = express();

didServer.PUBLIC_KEY = PUBLIC_KEY;

// HTTP

didServer.use(bodyParser.json({ limit: '50mb' }));

didServer.use(function(req, res, next) {
  res.renderJSONError = function(error, statusCode = 400){
    res.status(statusCode).json({error});
  };
  next();
});

didServer.get('/', function(req, res) {
  res.json({
    masterPublicKey: PUBLIC_KEY,
  });
});

didServer.post('/register', function(req, res) {
  const { did: didDocument, signature, secret } = req.body;
  if (!didDocument) return res.renderJSONError('did is required', 400);
  if (!signature) return res.renderJSONError('signature is required', 400);
  if (!secret) return res.renderJSONError('secret is required', 400);

  const id = didDocument.id;

  if (id in dids)
    return res.renderJSONError('pq: duplicate key value violates unique constraint "didstore_pkey"', 400);

  if (!isValidDidDocumentSignature({ didDocument, signature }))
    return res.renderJSONError('invlaid signature', 401);

  // const registrationSecret = decrypt({ didDocument })

  const encryptingPublicKey = didDocument.publicKey
    .find(key => key.id === `${id}#encrypting`)
    .publicKeyBase64
  ;

  const decodedCypherText = b64.decode(secret.cyphertext);
  let registrationSecret = Buffer.alloc(decodedCypherText.length - sodium.crypto_box_MACBYTES);
  sodium.crypto_box_open_easy(
    registrationSecret,
    decodedCypherText,
    b64.decode(secret.nonce),
    b64.decode(encryptingPublicKey),
    b64.decode(PRIVATE_KEY)
  );

  if (!registrationSecret)
    return res.renderJSONError('invlaid secret', 401);

  registrationSecret = registrationSecret.toString();

  const challenge = DidClient.createNonce();
  dids[id] = {didDocument, signature, secret, challenge, registrationSecret};

  res.json({ id, challenge });
});

didServer.post('/confirm', function(req, res) {
  const { challengeResponse } = req.body;
  if (!challengeResponse) return res.renderJSONError('challengeResponse is required', 400);

  const decodedJwt = jsonwebtoken.decode(challengeResponse);
  if (!decodedJwt) return res.renderJSONError('JWT is invalid', 401);
  const { id, signature } = decodedJwt;

  if (!(id in dids) || !dids[id].registrationSecret)
    return res.renderJSONError('JWT-DID does not exist', 401);

  const {didDocument, challenge, registrationSecret} = dids[id];
  try{
    jsonwebtoken.verify(challengeResponse, registrationSecret);
  }catch(error){
    return res.renderJSONError('JWT-signature is invalid', 401);
  }

  if (
    !isValidSignatureOf({ didDocument, signature, signedItem: challenge })
  ) return res.renderJSONError('signature does not verify', 401);

  dids[id].confirmed = true;

  res.json({ });
});

didServer.get('/root/:did', function(req, res) {
  const { did } = req.params;
  if (!(did in dids) || !dids[did].confirmed)
    return res.status(404).json({status: 'not found'});
  const { didDocument } = getRootDidDocument(did);
  res.json({ did: didDocument });
});

didServer.get('/:did', function(req, res) {
  const { did } = req.params;
  if (!(did in dids) || !dids[did].confirmed)
    return res.status(404).json({status: 'not found'});
  const { didDocument } = getLatestDidDocument(did);
  res.json({ did: didDocument });
});

didServer.post('/supersede', function(req, res) {
  const { did: didDocument, signature, supersedes } = req.body;
  if (!didDocument) return res.renderJSONError('did is required', 400);
  if (!signature) return res.renderJSONError('signature is required', 400);
  if (!supersedes) return res.renderJSONError('supersedes is required', 400);

  const id = didDocument.id;
  const challenge = DidClient.createNonce();

  if (id in dids)
    return res.renderJSONError('JWT-DID already exists', 401);

  dids[id] = { didDocument, signature, challenge, supersedes };

  res.json({ id, challenge });
});

didServer.post('/confirmSupersede', function(req, res) {
  const { challengeResponse } = req.body;
  if (!challengeResponse) return res.renderJSONError('challengeResponse is required', 400);

  const decodedJwt = jsonwebtoken.decode(challengeResponse);
  if (!decodedJwt) return res.renderJSONError('JWT is invalid', 401);
  const { id, signature } = decodedJwt;

  if (!(id in dids) || !dids[id].supersedes)
    return res.renderJSONError('JWT-DID does not exist', 401);

  const { didDocument, challenge, supersedes } = dids[id];
  const { registrationSecret } = getRootDidDocument(id);

  try{
    jsonwebtoken.verify(challengeResponse, registrationSecret);
  }catch(error){
    return res.renderJSONError('JWT-signature is invalid', 401);
  }

  if (
    !isValidSignatureOf({ didDocument, signature, signedItem: challenge })
  ) return res.renderJSONError('signature does not verify', 401);

  dids[supersedes].supersededBy = id;
  dids[id].confirmed = true;

  res.json({ id });
});

didServer.get('/history/:did', function(req, res) {
  const { did } = req.params;
  if (!(did in dids) || !dids[did].confirmed)
    return res.status(404).json({status: 'not found'});
  const history = [];

  let didRecord = dids[did];
  history.push({
    valid: new Date,
    did: didRecord.didDocument,
  });
  didRecord = dids[didRecord.supersedes];
  while(didRecord){
    history.push({
      superseded: new Date,
      did: didRecord.didDocument,
    });
    didRecord = dids[didRecord.supersedes];
  }

  res.json({ history: history.reverse() });
});


didServer.use(errorHandler({
  log: (error, errorAsString) => {
    console.error(`Request Error: ${errorAsString}`); // eslint-disable-line
  },
}));

didServer.start = async function(){
  didServer.port = await findOpenPort();
  didServer.url = `http://localhost:${didServer.port}/`;
  return await new Promise(resolve => {
    didServer.listen(didServer.port, 'localhost', function(error){
      error ? reject(error) : resolve();
    });
  });
};

let dids;
didServer.reset = function(){
  dids = {};
};

didServer.reset();
module.exports = didServer;

function getRootDidDocument(id){
  if (!dids[id]) throw new Error(`invalid did ${id}`);
  if (dids[id].supersedes) return getRootDidDocument(dids[id].supersedes);
  if (dids[id].registrationSecret) return dids[id];
}

function getLatestDidDocument(id){
  if (!dids[id]) throw new Error(`invalid did ${id}`);
  if (dids[id].supersededBy) return getLatestDidDocument(dids[id].supersededBy);
  return dids[id];
}

function isValidSignatureOf({ didDocument, signature, signedItem }){
  const signingPublicKey = didDocument.publicKey
    .find(key => key.id === `${didDocument.id}#signing`)
    .publicKeyBase64
  ;

  const hash = Buffer.alloc(sodium.crypto_hash_sha256_BYTES);
  sodium.crypto_hash_sha256(
    hash,
    Buffer.from(signedItem),
  );
  return !!sodium.crypto_sign_verify_detached(
    b64.decode(signature),
    hash,
    b64.decode(signingPublicKey)
  );
}

function isValidDidDocumentSignature({ didDocument, signature }){
  return isValidSignatureOf({
    didDocument, signature, signedItem: `${didDocument.id}.${didDocument.created}`
  });
}
