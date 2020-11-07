const Ajv = require('ajv');
const validation = require('../validation');
const Database = require('../../../database');
const ERRORS = require('../errors');

async function editDebt({accountId, debtId, amount, type} = {}) {
  const ajv = new Ajv();
  const areParametersCorrect = ajv.validate(
    {
      type: 'object',
      required: ['accountId', 'debtId'],
      properties: {
        accountId: validation.accountIdSchema,
        debtId: validation.publicIdSchema,
        amount: validation.amountSchema,
        type: validation.typeSchema,
      },
    },
    {accountId, debtId, amount, type}
  );

  const isAmountUndefined = typeof amount === 'undefined';
  const isTypeUndefined = typeof amount === 'undefined';

  if (!areParametersCorrect || (isAmountUndefined && isTypeUndefined)) {
    throw new Error('Some arguments are invalid');
  }

  const numberOfUpdatedRows = await Database.functions.debt.editDebt({
    accountId,
    debtId,
    amount,
    type,
  });

  if (!numberOfUpdatedRows) {
    return ERRORS.DEBT_NOT_FOUND;
  }

  return {
    id: debtId,
  };
}

module.exports = editDebt;
