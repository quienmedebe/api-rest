const signToken = require('./signToken');
const Database = require('../../../database');
const ERRORS = require('../errors');

async function createAccessTokenFromAccountId(accountId, config = {}, options = {}) {
  const account = await Database.functions.auth.getAccountFromId(accountId, options);

  if (!account) {
    return ERRORS.ACCOUNT_NOT_FOUND;
  }

  const JWTPayload = {
    id: account.public_id,
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

module.exports = function () {
  return module.exports.createAccessTokenFromAccountId.apply(this, arguments);
};
module.exports.createAccessTokenFromAccountId = createAccessTokenFromAccountId;
