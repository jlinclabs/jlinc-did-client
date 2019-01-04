'use strict';

module.exports = async function supersedeRequest({ did, keys }) {
  if (!did) throw new Error('did is required');
  if (!keys) throw new Error('keys is required');

  const { didDocument, signature } = this.createDidDocument({ keys });

  const { id: newDid, challenge } = await this.request({
    method: 'post',
    path: '/supersede',
    body: {
      did: didDocument,
      signature,
      supersedes: did,
    },
  });

  return { newDid, challenge };
};
