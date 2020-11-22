const Shared = require('../../../modules/shared');
const {Account, GoogleProvider} = require('../../models');

async function getAccountFromGoogleId(googleId) {
  if (!Shared.isString(googleId, {strict: true})) {
    throw new Error('The Google id must be a string');
  }

  const account = await Account.findOne({
    include: [
      {
        model: GoogleProvider,
        as: 'google_providers',
        required: true,
        where: {
          id: googleId,
        },
      },
    ],
  });

  return account;
}

module.exports = getAccountFromGoogleId;
