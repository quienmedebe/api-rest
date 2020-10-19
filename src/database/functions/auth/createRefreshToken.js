const Shared = require('../../../modules/shared');
const {RefreshToken} = require('../../../database/models');

async function createRefreshToken(accountId, refreshTokenOptions = {}, options = {}) {
  if (!Shared.isNumber(accountId)) {
    throw new Error(`The account id must be a number. Received: ${accountId}`);
  }

  if (refreshTokenOptions.expiration_datetime && !Shared.isNumber(refreshTokenOptions.expiration_datetime)) {
    throw new Error(`The expiration datetime must be a number if it is present. Received: ${refreshTokenOptions.expiration_datetime}`);
  }

  const expirationDateTime = refreshTokenOptions.expiration_datetime ? refreshTokenOptions.expiration_datetime : null;

  const refreshToken = await RefreshToken.create(
    {
      account_id: accountId,
      expiration_datetime: expirationDateTime,
    },
    options
  );

  return refreshToken;
}

module.exports = createRefreshToken;
