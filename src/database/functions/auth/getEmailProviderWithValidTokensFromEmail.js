const {EmailProvider, EmailToken, Sequelize} = require('../../models');

async function getEmailProviderWithValidTokensFromEmail(email, options = {}) {
  const emailDB = await EmailProvider.findOne({
    where: {
      email,
    },
    include: [
      {
        model: EmailToken,
        as: 'tokens',
        where: {
          expiration_datetime: {
            [Sequelize.Op.gte]: Date.now(),
          },
          valid: true,
        },
        required: false,
      },
    ],
    ...options,
  });

  return emailDB;
}

module.exports = getEmailProviderWithValidTokensFromEmail;
