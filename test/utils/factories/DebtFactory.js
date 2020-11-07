const faker = require('faker');
const {Debt} = require('../../../src/database/models');

const createProperties = async (props = {}) => {
  return {
    account_id: null,
    amount: faker.random.number(1000),
    type: 'DEBT',
    ...props,
  };
};

async function DebtFactory(props = {}, json = true) {
  const properties = await createProperties(props);
  const instance = await Debt.create(properties);

  if (json) {
    return instance.toJSON();
  }

  return instance;
}

DebtFactory.findAllByAccountId = async (accountId, json = true) => {
  const debts = await Debt.findAll({
    where: {
      account_id: accountId,
    },
  });

  if (debts && json) {
    return debts.map(debt => debt.toJSON());
  }

  return debts;
};

DebtFactory.findByPublicId = async (publicDebtId, json = true) => {
  const instance = await Debt.findOne({
    where: {
      public_id: publicDebtId,
    },
  });

  if (instance && json) {
    return instance.toJSON();
  }

  return instance;
};

DebtFactory.findByPublicIdParanoid = async (publicDebtId, json = true) => {
  const instance = await Debt.findOne({
    where: {
      public_id: publicDebtId,
    },
    paranoid: false,
  });

  if (instance && json) {
    return instance.toJSON();
  }

  return instance;
};

module.exports = DebtFactory;
