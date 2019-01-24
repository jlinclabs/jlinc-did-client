'use strict';

module.exports = async function history({ did }) {
  const { ResourceNotFoundError, DIDNotFoundError } = this;

  if (!did) throw new Error('did is required');

  try{
    const { history } = await this.request({
      method: 'get',
      path: `/history/${did}`,
    });
    return history;
  }catch(error){
    if (error instanceof ResourceNotFoundError){
      throw new DIDNotFoundError('did not found');
    }
    throw error;
  }
};
