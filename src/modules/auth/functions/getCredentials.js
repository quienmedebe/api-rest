const Ajv = require('ajv');
const Database = require('../../../database');
const validation = require('../validation');
const getAccessTokenFromRefreshToken = require('./getAccessTokenFromRefreshToken');

async function getCredentials(accountId, {logger, accessTokenSecret, accessTokenExpirationTime, refreshTokenExpirationTime}) {
  const ajv = new Ajv({logger});
  const isAccountIdValid = ajv.validate(validation.accountIdSchema, accountId);

  if (!isAccountIdValid) {
    throw new Error('Invalid account id');
  }

  const refreshTokenOptions = {
    expiration_datetime: refreshTokenExpirationTime,
  };

  const accessTokenOptions = {
    logger,
    expiresIn: accessTokenExpirationTime,
    secret: accessTokenSecret,
  };

  const DBRefreshToken = await Database.models.sequelize.transaction(async t => {
    let token;
    const previousRefreshToken = await Database.functions.auth.getActiveRefreshTokenFromAccount(accountId, {transaction: t});
    if (!previousRefreshToken) {
      token = await Database.functions.auth.createRefreshToken(accountId, refreshTokenOptions, {transaction: t});
    } else {
      token = previousRefreshToken;
    }

    return token;
  });

  const refreshToken = DBRefreshToken.id;
  const accessTokenResponse = await getAccessTokenFromRefreshToken(accountId, refreshToken, accessTokenOptions);

  if (accessTokenResponse.error) {
    return accessTokenResponse;
  }

  return {
    accessToken: accessTokenResponse.accessToken,
    refreshToken,
  };
}

module.exports = getCredentials;
