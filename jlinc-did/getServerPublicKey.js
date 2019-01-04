'use strict';

module.exports = async function(){
  if (this._serverPublicKey) return this._serverPublicKey;
  const { masterPublicKey } = await this.request({ method: 'get', path: '/' });
  if (typeof masterPublicKey !== 'string' || masterPublicKey.length < 30)
    throw new RequestError('unable to get serverPublicKey');
  return this._serverPublicKey = masterPublicKey;
};
