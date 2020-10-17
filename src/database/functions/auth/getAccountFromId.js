const Shared = require('../../../modules/shared');
const {Account} = require('../../models');
const ERRORS = require('./errors');

async function getAccountFromId(id) {
  if (!Shared.isNumber(id)) {
    throw new Error('The id must be a number');
  }

  const account = await Account.findOne({
    where: {
      id: id,
    },
  });

  if (!account) {
    return Shared.sendResponse(Shared.sendResponse.ERROR, ERRORS.ACCOUNT_NOT_FOUND);
  }

  return Shared.sendResponse(Shared.sendResponse.OK, account);
}

module.exports = getAccountFromId;
