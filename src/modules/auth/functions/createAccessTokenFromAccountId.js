const signToken = require('./signToken');
const Database = require('../../../database');
const ERRORS = require('../errors');

async function createAccessTokenFromAccountId(accountId, config = {}, options = {}) {
  const account = await Database.functions.auth.getAccountFromId(accountId, options);

  if (!account) {
    return ERRORS.ACCOUNT_NOT_FOUND;
  }

  const JWTPayload = {
    id: +account.id,
  };

  const {secret, logger, ...JWTOptions} = config;
  const JWTConfig = {
    secret,
    logger,
  };

  const accessToken = signToken(JWTPayload, JWTOptions, JWTConfig);

  return {
    accessToken,
  };
}

module.exports = createAccessTokenFromAccountId;
