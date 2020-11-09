const Ajv = require('ajv');
const validation = require('../validation');
const Database = require('../../../database');

async function getDebtByPublicId({accountId, debtId} = {}) {
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

  const debt = await Database.functions.debt.getDebtByPublicId({
    accountId,
    debtId,
  });

  if (!debt) {
    return debt;
  }

  const jsonDebt = debt.toJSON();
  delete jsonDebt.id;
  const parsedDebt = {
    id: jsonDebt.public_id,
    ...jsonDebt,
  };
  delete parsedDebt.public_id;

  return parsedDebt;
}

module.exports = getDebtByPublicId;
