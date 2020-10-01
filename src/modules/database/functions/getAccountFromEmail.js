const Shared = require('../../shared');
const {Account, EmailProvider} = require('../models');

async function getAccountFromEmail(email) {
  if (!Shared.isString(email, {strict: true})) {
    throw new Error('The email is required');
  }

  await EmailProvider.findOne({
    where: {
      email,
    },
    include: [
      {
        model: Account,
        as: 'account',
        required: true,
      },
    ],
  });
}

module.exports = getAccountFromEmail;
