const {Debt} = require('../../models');

async function createDebt({accountId, amount, type, ...attributes} = {}, config = {}) {
  const {...options} = config;

  const newDebt = await Debt.create(
    {
      account_id: accountId,
      amount,
      type,
      ...attributes,
    },
    options
  );

  return newDebt;
}

module.exports = createDebt;
