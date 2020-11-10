const Ajv = require('ajv');
const noopLogger = require('noop-logger');
const Validation = require('../validation');
const Database = require('../../../database');

async function getAccountPrivateIdFromPublicId(publicAccountId, {logger = noopLogger} = {}) {
  const ajv = new Ajv();
  const areValidArguments = ajv.validate(
    {
      type: 'object',
      properties: {
        publicAccountId: Validation.accountPublicIdSchema,
      },
    },
    {publicAccountId}
  );

  if (!areValidArguments) {
    logger.info('Invalid arguments', {publicAccountId});
    throw new Error('Invalid arguments');
  }

  const account = await Database.functions.auth.getAccountFromPublicId(publicAccountId);

  if (!account) {
    return null;
  }

  return +account.id;
}

module.exports = getAccountPrivateIdFromPublicId;
