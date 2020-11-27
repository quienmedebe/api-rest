const randomToken = require('rand-token');
const {GoogleProvider} = require('../../../src/database/models');

const createProperties = async (props = {}) => {
  return {
    id: randomToken.uid(255),
    ...props,
  };
};

async function GoogleProviderFactory(props = {}, json = true) {
  const properties = await createProperties(props);
  const instance = await GoogleProvider.create(properties);

  if (json) {
    return instance.toJSON();
  }

  return instance;
}

GoogleProviderFactory.findById = async (id, json = true) => {
  const instance = await GoogleProvider.findOne({
    where: {
      id,
    },
  });

  if (instance && json) {
    return instance.toJSON();
  }

  return instance;
};

GoogleProviderFactory.findByAccountId = async (accountId, json = true) => {
  const instance = await GoogleProvider.findOne({
    where: {
      account_id: accountId,
    },
  });

  if (instance && json) {
    return instance.toJSON();
  }

  return instance;
};

module.exports = GoogleProviderFactory;
