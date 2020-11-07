const {Debt} = require('../../models');

async function removeDebt({accountId, debtId} = {}, config = {}) {
  const {...options} = config;

  const destroyedRows = await Debt.destroy({
    where: {
      account_id: accountId,
      public_id: debtId,
    },
    ...options,
  });

  return destroyedRows;
}

module.exports = removeDebt;
