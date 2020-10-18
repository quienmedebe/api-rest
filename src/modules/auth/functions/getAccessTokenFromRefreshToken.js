const Ajv = require('ajv');
const Validation = require('../validation');
const Database = require('../../../database');
const {sequelize} = require('../../../database/models');
const ERRORS = require('../errors');
const createAccessTokenFromAccountId = require('./createAccessTokenFromAccountId');

async function getAccessTokenFromRefreshToken(accountId, refreshToken, {logger, secret, expiresIn}) {
  const ajv = new Ajv({logger});
  const isValidAccountId = ajv.validate(Validation.accountIdSchema, accountId);
  const isValidRefreshToken = ajv.validate(Validation.refreshTokenSchema, refreshToken);

  if (!isValidAccountId || !isValidRefreshToken) {
    throw new Error('Invalid arguments');
  }

  try {
    const response = await sequelize.transaction(async t => {
      const DBRefreshToken = await Database.functions.auth.getRefreshToken(accountId, refreshToken, {transaction: t});
      if (!DBRefreshToken) {
        throw ERRORS.REFRESH_TOKEN_NOT_FOUND;
      }

      const accessTokenOptions = {
        logger,
        secret,
        expiresIn,
      };
      const accessTokenFromAccount = await createAccessTokenFromAccountId(accountId, accessTokenOptions, {transaction: t});

      if (accessTokenFromAccount.error) {
        throw accessTokenFromAccount;
      }

      DBRefreshToken.issued_tokens += 1;
      await DBRefreshToken.save({transaction: t});

      return accessTokenFromAccount;
    });

    return response;
  } catch (error) {
    return error;
  }
}

module.exports = getAccessTokenFromRefreshToken;
