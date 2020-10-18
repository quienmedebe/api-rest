const Shared = require('../../../modules/shared');
const {RefreshToken, Sequelize} = require('../../models');

async function getRefreshToken(accountId, refreshToken, options = {}) {
  if (!Shared.isNumber(accountId)) {
    throw new Error(`The account id must be a number. Received: ${accountId}`);
  }

  if (!Shared.isString(refreshToken, {strict: true})) {
    throw new Error(`The refresh token must be a string. Received: ${refreshToken}`);
  }

  const token = await RefreshToken.findOne({
    where: {
      id: refreshToken,
      account_id: accountId,
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
    ...options,
  });

  return token;
}

module.exports = getRefreshToken;
