const Ajv = require('ajv');
const math = require('exact-math');
const validation = require('../validation');
const Database = require('../../../database');

async function getAccountBalance({accountId} = {}) {
  const ajv = new Ajv();
  const areParametersCorrect = ajv.validate(
    {
      type: 'object',
      required: ['accountId'],
      properties: {
        accountId: validation.accountIdSchema,
      },
    },
    {accountId}
  );

  if (!areParametersCorrect) {
    throw new Error('Some arguments are invalid');
  }

  const {debts, credits} = await Database.functions.debt.getAccountBalance({
    accountId,
  });

  const balance = math.sub(credits, debts);

  return balance;
}

module.exports = getAccountBalance;
