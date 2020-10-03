const Shared = require('../../../shared');
const {Account, EmailProvider} = require('../../models');

async function getAccountFromEmail(email) {
  if (!Shared.isString(email, {strict: true})) {
    throw new Error('The email must be a string');
  }

  await Account.findOne({
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
}

module.exports = getAccountFromEmail;
