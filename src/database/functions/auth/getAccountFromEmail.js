const ERRORS = require('./errors');
const Shared = require('../../../modules/shared');
const {Account, EmailProvider} = require('../../models');

async function getAccountFromEmail(email) {
  if (!Shared.isString(email, {strict: true})) {
    throw new Error('The email must be a string');
  }

  const account = await Account.findOne({
    include: [
      {
        model: EmailProvider,
        as: 'email_providers',
        required: true,
        where: {
          email,
        },
      },
    ],
  });

  if (!account) {
    return Shared.sendResponse(Shared.sendResponse.ERROR, ERRORS.ACCOUNT_NOT_FOUND);
  }

  return Shared.sendResponse(Shared.sendResponse.OK, account);
}

module.exports = getAccountFromEmail;
