const emailExists = require('./emailExists');
const ERRORS = require('./errors');
const {Account, EmailProvider, sequelize} = require('../../models');
const Shared = require('../../../modules/shared');

const createAccountFromEmailAndPassword = async (email, password, accountAttributes = {}) => {
  const response = await sequelize.transaction(async t => {
    const doesEmailExist = await emailExists(email, {transaction: t});

    if (doesEmailExist) {
      return Shared.sendResponse(Shared.sendResponse.ERROR, ERRORS.DUPLICATE_EMAIL);
    }

    const account = await Account.create(
      {
        ...accountAttributes,
        email_providers: [
          {
            email,
            password,
          },
        ],
      },
      {
        include: [
          {
            model: EmailProvider,
            as: 'email_providers',
          },
        ],
        transaction: t,
      }
    );

    return Shared.sendResponse(Shared.sendResponse.OK, account);
  });

  return response;
};

module.exports = createAccountFromEmailAndPassword;
