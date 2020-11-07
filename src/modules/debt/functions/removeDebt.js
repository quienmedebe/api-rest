const Ajv = require('ajv');
const validation = require('../validation');
const Database = require('../../../database');
const ERRORS = require('../errors');

async function removeDebt({accountId, debtId} = {}) {
  const ajv = new Ajv();
  const areParametersCorrect = ajv.validate(
    {
      type: 'object',
      required: ['accountId', 'debtId'],
      properties: {
        accountId: validation.accountIdSchema,
        debtId: validation.publicIdSchema,
      },
    },
    {accountId, debtId}
  );

  if (!areParametersCorrect) {
    throw new Error('Some arguments are invalid');
  }

  const numberOfDestroyedRows = await Database.functions.debt.removeDebt({
    accountId,
    debtId,
  });

  if (!numberOfDestroyedRows) {
    return ERRORS.DEBT_NOT_FOUND;
  }

  return {
    id: debtId,
  };
}

module.exports = removeDebt;
