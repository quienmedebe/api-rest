const {Debt} = require('../../models');

async function getDebtByPublicId({accountId, debtId} = {}, config = {}) {
  const {...options} = config;

  const debt = await Debt.findOne({
    where: {
      account_id: accountId,
      public_id: debtId,
    },
    ...options,
  });

  return debt;
}

module.exports = getDebtByPublicId;
