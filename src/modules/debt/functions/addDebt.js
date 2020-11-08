const Ajv = require('ajv');
const validation = require('../validation');
const Database = require('../../../database');

async function addDebt({accountId, amount, type} = {}) {
  const ajv = new Ajv();
  const areParametersCorrect = ajv.validate(
    {
      type: 'object',
      required: ['accountId', 'amount', 'type'],
      properties: {
        accountId: validation.accountIdSchema,
        amount: validation.amountSchema,
        type: validation.typeSchema,
      },
    },
    {accountId, amount, type}
  );

  if (!areParametersCorrect) {
    throw new Error('Some arguments are invalid');
  }

  const newDebt = await Database.functions.debt.createDebt({
    accountId,
    amount,
    type,
  });

  const jsonNewDebt = newDebt.toJSON();

  delete jsonNewDebt.id;
  const {public_id, ...attributes} = jsonNewDebt;

  const parsedNewDebt = {
    id: public_id,
    ...attributes,
  };

  return parsedNewDebt;
}

module.exports = addDebt;
