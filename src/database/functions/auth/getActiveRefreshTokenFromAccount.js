const Shared = require('../../../modules/shared');
const {RefreshToken, Sequelize} = require('../../../database/models');

async function getActiveRefreshTokenFromAccount(accountId, options = {}) {
  if (!Shared.isNumber(accountId)) {
    throw new Error(`The account id must be a number. Received: ${accountId}`);
  }

  const refreshToken = await RefreshToken.findOne({
    where: {
      accountId: accountId,
      [Sequelize.Op.or]: [
        {
          expiration_datetime: {
            [Sequelize.Op.gte]: Date.now(),
          },
        },
        {
          expiration_datetime: {
            [Sequelize.Op.is]: null,
          },
        },
      ],
      valid: true,
    },
    order: [['expiration_datetime', 'ASC NULLS LAST']],
    ...options,
  });

  return refreshToken;
}

module.exports = getActiveRefreshTokenFromAccount;
