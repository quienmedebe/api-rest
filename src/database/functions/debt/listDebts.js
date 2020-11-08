const {Debt} = require('../../models');

async function listDebts({accountId, page = 1, pageSize = 25} = {}, config = {}) {
  const {...options} = config;

  const offset = (page - 1) * pageSize;

  const listOfDebts = await Debt.findAndCountAll({
    where: {
      account_id: accountId,
    },
    limit: pageSize,
    offset,
    ...options,
  });

  return listOfDebts;
}

module.exports = listDebts;
