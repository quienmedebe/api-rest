const Ajv = require('ajv');
const validation = require('../validation');
const Database = require('../../../database');

async function listDebts({accountId, page = 1, pageSize = 25} = {}) {
  const ajv = new Ajv();
  const areParametersCorrect = ajv.validate(
    {
      type: 'object',
      required: ['accountId', 'page', 'pageSize'],
      properties: {
        accountId: validation.accountIdSchema,
        page: {
          type: 'number',
          minimum: 1,
        },
        pageSize: {
          type: 'number',
          minimum: 1,
        },
      },
    },
    {accountId, page, pageSize}
  );

  if (!areParametersCorrect) {
    throw new Error('Some arguments are invalid');
  }

  const listOfDebts = await Database.functions.debt.listDebts({
    accountId,
    page,
    pageSize,
  });

  const parsedRows = listOfDebts.rows
    .map(debt => debt.toJSON())
    .map(debt => {
      delete debt.id;
      const {public_id, ...attributes} = debt;
      return {id: public_id, ...attributes};
    });

  return {
    rows: parsedRows,
    count: listOfDebts.count,
    page: listOfDebts.page,
    pageSize: listOfDebts.pageSize,
  };
}

module.exports = listDebts;
