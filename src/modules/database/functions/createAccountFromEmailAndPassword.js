const {Account, EmailProvider} = require('../models');

const createAccountFromEmailAndPassword = async (email, password, accountAttributes = {}) => {
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
    }
  );

  return account;
};

module.exports = createAccountFromEmailAndPassword;
