# Node JLINC

A node implementation of the JLINC protocol

Spec: https://did-spec.jlinc.org/

Specifically: https://did-spec.jlinc.org/#6-operations

## Nomenclature

### entity

An entity looks like this:

```js
{
  did,
  registrationSecret,
  signingPublicKey,
  signingPrivateKey,
  encryptingPublicKey,
  encryptingPrivateKey,
}
```

### did

`"did:jlinc:xxxxxxxxxxxxxxxxxxxxxxxxx`

### didDocument

```js
const didDocument = {
  '@context': didClient.contextUrl,
  id: entity.did,
  created: '2019-01-08T21:12:36.505Z',
  publicKey: [
    {
      id: `${entity.did}#signing`,
      type: 'ed25519',
      owner: entity.did,
      publicKeyBase64: entity.signingPublicKey
    },
    {
      id: `${entity.did}#encrypting`,
      type: 'curve25519',
      owner: entity.did,
      publicKeyBase64: entity.encryptingPublicKey
    },
  ],
};
```

## Expected Usage

```js

const entity = await didClient.register();

entity.did // your public did string
entity.registrationSecret,   // persist and protect this (you need this to supersede this did)
entity.signingPublicKey,     // persist this as is
entity.signingPrivateKey,    // persist and protect this
entity.encryptingPublicKey,  // persist this
entity.encryptingPrivateKey, // persist and protect this
```

## Development

### Creating keys for the server

```js
console.log(require('.').createKeys())
```

and you should get back something like:
```json
{
  "success": true,
  "status": 200,
  "entity": {
    "signingPublicKey": "BfzAYJZrQ5dNJ_QyA6bkonGqRFOwgQ5uJ9-3ggsjF-U",
    "signingPrivateKey": "xPJb_Y6ndxDGSck-u_Q9fpXL3P3yHARCHbeIX4LED5IF_MBglmtDl00n9DIDpuSicapEU7CBDm4n37eCCyMX5Q",
    "encryptingPublicKey": "G3k0kFObBo9CMl__q2CSCyk-h4CLTNvkdRQyMUQDgG4",
    "encryptingPrivateKey": "WxTMDOZTYOtyTjc2RXUGeBiwwv0G6Nxkar5WbFiluLo",
    "registrationSecret": "0acaae07daa734f7a10a1cf45ea478ae248c2185002e5632220cdd3976b370af"
  },
  "confirmable": {
    "id": "did:jlinc:BfzAYJZrQ5dNJ_QyA6bkonGqRFOwgQ5uJ9-3ggsjF-U",
    "challenge": "9330390573a944af2840e2d8dd29bdcc4a7f51192f871bd562c9044bf61da8cf"
  }
}
```

Copy the `encryptingPublicKey` and `encryptingPrivateKey` to your servers `config.toml`

### Manual Testing! :D

```js
const jlincDidClient = require('.');
jlincDidClient.createEntity()
  .then(response =>
    jlincDidClient.registerConfirm(response.entity, response.confirmable)
  )
  .then(
    console.log,
    console.error
  )
;
```
