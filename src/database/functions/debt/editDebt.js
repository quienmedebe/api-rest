const {Debt} = require('../../models');

async function editDebt({accountId, debtId, amount, type, status}, config = {}) {
  const {...options} = config;

  const updateAmount = typeof amount !== 'undefined' ? {amount} : {};
  const updateType = typeof type !== 'undefined' ? {type} : {};
  const updateStatus = typeof status !== 'undefined' ? {status} : {};

  const editedRows = await Debt.update(
    {
      ...updateAmount,
      ...updateType,
      ...updateStatus,
    },
    {
      where: {
        account_id: accountId,
        public_id: debtId,
      },
      ...options,
    }
  );

  return editedRows;
}

module.exports = editDebt;
