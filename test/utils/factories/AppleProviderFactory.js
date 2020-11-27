const randomToken = require('rand-token');
const faker = require('faker');
const {AppleProvider} = require('../../../src/database/models');

const createProperties = async (props = {}) => {
  return {
    id: randomToken.uid(21),
    email: faker.internet.email(),
    ...props,
  };
};

async function AppleProviderFactory(props = {}, json = true) {
  const properties = await createProperties(props);
  const instance = await AppleProvider.create(properties);

  if (json) {
    return instance.toJSON();
  }

  return instance;
}

AppleProviderFactory.findById = async (id, json = true) => {
  const instance = await AppleProvider.findOne({
    where: {
      id,
    },
  });

  if (instance && json) {
    return instance.toJSON();
  }

  return instance;
};

AppleProviderFactory.findByAccountId = async (accountId, json = true) => {
  const instance = await AppleProvider.findOne({
    where: {
      account_id: accountId,
    },
  });

  if (instance && json) {
    return instance.toJSON();
  }

  return instance;
};

module.exports = AppleProviderFactory;
