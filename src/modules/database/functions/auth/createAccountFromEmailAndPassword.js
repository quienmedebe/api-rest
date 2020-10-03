const isEmailUnique = require('./isEmailUnique');
const {Account, EmailProvider, sequelize} = require('../../models');

const createAccountFromEmailAndPassword = async (email, password, accountAttributes = {}) => {
  const response = await sequelize.transaction(async t => {
    const canCreateAccount = await isEmailUnique(email, {transaction: t});

    if (!canCreateAccount) {
      return null;
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

    return account;
  });

  return response;
};

module.exports = createAccountFromEmailAndPassword;
