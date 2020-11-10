const Shared = require('../../../modules/shared');
const {Account} = require('../../models');

async function getAccountFromPublicId(id, options = {}) {
  if (!Shared.isString(id)) {
    throw new Error('The id must be a string');
  }

  const account = await Account.findOne({
    where: {
      public_id: id,
    },
    ...options,
  });

  return account;
}

module.exports = getAccountFromPublicId;
