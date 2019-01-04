'use strict';

module.exports = async function register(options={}) {
  const keys = options.keys || this.createKeys();
  const { did, registrationSecret, challenge } = await this.registerRequest({ keys });
  return await this.registerConfirm({ did, registrationSecret, challenge, keys });
};
