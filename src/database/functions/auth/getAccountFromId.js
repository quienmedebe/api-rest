const Shared = require('../../../modules/shared');
const {Account} = require('../../models');

async function getAccountFromId(id, options = {}) {
  if (!Shared.isNumber(id)) {
    throw new Error('The id must be a number');
  }

  const account = await Account.findOne({
    where: {
      id: id,
    },
    ...options,
  });

  return account;
}

module.exports = getAccountFromId;
