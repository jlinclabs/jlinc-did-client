# Node JLINC

A node client for the JLINC DID Server

Specs:

- https://did-spec.jlinc.org/
- https://w3c.github.io/did-core/

Specifically: https://did-spec.jlinc.org/#6-operations

## Nomenclature

### Entity

An entity is a specific DID record with its corresponding keys and secrets. It looks like this:

```js
const entity = {
  did: 'did:jlinc:dnhZF0DuRHgZ0wetY4S7ygsrCQMUzUZoxLxosEmbIYM',
  signingPublicKey: 'dnhZF0DuRgsrCQMUzUZoxLHgZ0wetY4S7yxosEmbIYM',
  signingPrivateKey: 'g2eFkXQO5EeBnTS_FdcbVV_ttiw53sHHENlXCZl5xH5rqwGVWwo9jLG-B61jhLvKCysJAxTNRmjEvGiwSZshgw',
  encryptingPublicKey: 'BK478lOPXtO9J2KsWq_M_opXcVqCiAYd0TWOJcATjX8',
  encryptingPrivateKey: '4LMoOgJQMq2NYWAb7RAkCA0cnMN7QCGZQJROgWmCEdI',
  registrationSecret: '929afc44b7f692ac8fb615467e5eb910325b73d3adb1c504fd46a77edef22235'
};
```

### DID

A DID: `did:jlinc:dnhZF0DuRHgZ0wetY4S7ygsrCQMUzUZoxLxosEmbIYM` is the unique Decentralized Identifier.


### DID Document

A DID Document is a JSON objected sent to and received by the JLINC DID Server. It looks like this

```json
{
  "@context": "https://w3id.org/did/v1",
  "id": "did:jlinc:dnhZF0DuRHgZ0wetY4S7ygsrCQMUzUZoxLxosEmbIYM",
  "created": "2019-01-08T21:12:36.505Z",
  "publicKey": [
    {
      "id": "did:jlinc:dnhZF0DuRHgZ0wetY4S7ygsrCQMUzUZoxLxosEmbIYM#signing",
      "type": "ed25519",
      "owner": "did:jlinc:dnhZF0DuRHgZ0wetY4S7ygsrCQMUzUZoxLxosEmbIYM",
      "publicKeyBase64": "dnhZF0DuRgsrCQMUzUZoxLHgZ0wetY4S7yxosEmbIYM"
    },
    {
      "id": "did:jlinc:dnhZF0DuRHgZ0wetY4S7ygsrCQMUzUZoxLxosEmbIYM#encrypting",
      "type": "curve25519",
      "owner": "did:jlinc:dnhZF0DuRHgZ0wetY4S7ygsrCQMUzUZoxLxosEmbIYM",
      "publicKeyBase64": "BK478lOPXtO9J2KsWq_M_opXcVqCiAYd0TWOJcATjX8"
    },
  ],
}
```

## Expected Usage

```js
const { DidClient } = require('jlinc-did-client');

// point the client to a did server
DidClient.setConfig({
  didServerUrl: 'http://did.jlinc.test',
})

async function example(){
  const entity = await DidClient.register();
  // Persist all of these values
  entity.did;
  entity.signingPublicKey;
  entity.signingPrivateKey;
  entity.encryptingPublicKey;
  entity.encryptingPrivateKey;
  entity.registrationSecret;

  const didDocument = await DidClient.resolve({ did: entity.did });

  // supersede a did
  const entityTwo = await DidClient.supersede({ entity });

  // get a history of the DIDs behind this did
  const history = await DidClient.history({ did: entityTwo.did });
}
```
