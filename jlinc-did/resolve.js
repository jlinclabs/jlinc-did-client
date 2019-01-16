'use strict';

module.exports = async function resolve({ did, root = false }) {
  const { ResourceNotFoundError, DIDNotFoundError } = this;

  if (!did) throw new Error(`did is required`);
  if (typeof did !== 'string') throw new Error(`did must of type string`);

  try{
    const { did: didDocument } = await this.request({
      method: 'get',
      path: root ? `/root/${did}` : `/${did}`,
      followRedirect: true,
    });
    return didDocument;
  }catch(error){
    if (error instanceof ResourceNotFoundError){
      throw new DIDNotFoundError('did not found');
    }
    throw error;
  }
};
