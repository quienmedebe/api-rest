const Ajv = require('ajv');
const validation = require('../validation');
const Database = require('../../../database');
const ERRORS = require('../errors');

async function editDebt({accountId, debtId, amount, type, status} = {}) {
  const ajv = new Ajv({allErrors: true});
  const areParametersCorrect = ajv.validate(
    {
      type: 'object',
      required: ['accountId', 'debtId'],
      properties: {
        accountId: validation.accountIdSchema,
        debtId: validation.publicIdSchema,
        amount: validation.amountSchema,
        type: validation.typeSchema,
        status: validation.statusSchema,
      },
    },
    {accountId, debtId, amount, type, status}
  );

  const isAmountUndefined = typeof amount === 'undefined';
  const isTypeUndefined = typeof type === 'undefined';
  const isStatusUndefined = typeof status === 'undefined';

  if (!areParametersCorrect || (isAmountUndefined && isTypeUndefined && isStatusUndefined)) {
    throw new Error('Some arguments are invalid');
  }

  const [numberOfUpdatedRows] = await Database.functions.debt.editDebt({
    accountId,
    debtId,
    amount,
    type,
    status,
  });

  if (!numberOfUpdatedRows) {
    return ERRORS.DEBT_NOT_FOUND;
  }

  return {
    id: debtId,
  };
}

module.exports = editDebt;
