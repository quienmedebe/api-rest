const {signToken} = require('.');
const {Account} = require('../../../database/models');
const ERRORS = require('../errors');

async function createAccessTokenFromAccountId(accountId, config = {}, options = {}) {
  const account = await Account.findOne({
    where: {
      id: accountId,
    },
    ...options,
  });

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
