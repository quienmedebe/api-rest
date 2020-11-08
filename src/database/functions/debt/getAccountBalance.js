const math = require('exact-math');
const {Debt} = require('../../models');

async function getAccountBalance({accountId} = {}, config = {}) {
  const {...options} = config;

  const balances = await Debt.findAll({
    attributes: ['amount', 'type'],
    where: {
      account_id: accountId,
    },
    group: ['amount', 'type'],
    raw: true,
    ...options,
  });

  const debts = balances
    .filter(({type}) => type === 'DEBT')
    .map(({amount}) => +amount)
    .reduce((acc, next) => math.add(acc, next), 0);
  const credits = balances
    .filter(({type}) => type === 'CREDIT')
    .map(({amount}) => +amount)
    .reduce((acc, next) => math.add(acc, next), 0);

  return {
    debts,
    credits,
  };
}

module.exports = getAccountBalance;
