const Shared = require('../../shared');
const {Account} = require('../models');

async function getAccountFromId(id) {
  if (!Shared.isNumber(id)) {
    throw new Error('The id must be a number');
  }

  const account = await Account.findOne({
    where: {
      id: id,
    },
  });

  return account;
}

module.exports = getAccountFromId;
