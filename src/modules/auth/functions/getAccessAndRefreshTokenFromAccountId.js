const noopLogger = require('noop-logger');
const getCredentials = require('./getCredentials');
const Shared = require('../../shared');

async function getAccessAndRefreshTokenFromAccountId(
  accountId,
  {logger = noopLogger, accessTokenSecret, accessTokenExpirationTimeSeconds, refreshTokenExpirationTimeMs} = {}
) {
  if (!Shared.isNumber(accountId)) {
    throw new Error('The account id must be a number');
  }

  const credentialOptions = {
    logger,
    accessTokenSecret: accessTokenSecret,
    accessTokenExpirationTime: accessTokenExpirationTimeSeconds,
    refreshTokenExpirationTime: refreshTokenExpirationTimeMs,
  };

  const credentials = await getCredentials(accountId, credentialOptions);
  if (credentials.error) {
    logger.info('Invalid credentials');
    return credentials;
  }

  const response = {
    access_token: credentials.accessToken,
    refresh_token: credentials.refreshToken,
  };

  return response;
}

module.exports = getAccessAndRefreshTokenFromAccountId;
