# Node JLINC

A node implementation of the JLINC protocol

Spec: https://did-spec.jlinc.org/

Specifically: https://did-spec.jlinc.org/#6-operations

## Nomenclature

## Expected Usage

## Development

### Creating keys for the server

```js
require('.').createEntity().then(console.log)
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
