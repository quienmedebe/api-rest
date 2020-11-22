const {Account, GoogleProvider} = require('../../models');

const createAccountFromGoogleId = async (googleId, accountAttributes = {}) => {
  const account = await Account.create(
    {
      ...accountAttributes,
      google_providers: [
        {
          id: googleId,
        },
      ],
    },
    {
      include: [
        {
          model: GoogleProvider,
          as: 'google_providers',
        },
      ],
    }
  );

  return account;
};

module.exports = createAccountFromGoogleId;
