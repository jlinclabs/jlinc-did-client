'use strict';

module.exports = async function supersede({ entity, keys }) {
  if (!entity) throw new Error('entity is required');
  keys = keys || this.createKeys();
  const { newDid, challenge } = await this.supersedeRequest({ did: entity.did, keys });
  return await this.supersedeConfirm({ entity, keys, newDid, challenge });
};
