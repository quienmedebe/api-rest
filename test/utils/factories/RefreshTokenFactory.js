const randomToken = require('rand-token');
const {RefreshToken} = require('../../../src/database/models');

const createProperties = async (props = {}) => {
  return {
    id: randomToken.uid(255),
    expiration_datetime: !props.expiration_datetime ? null : Date.now() + 1000 * 60 * 60 * 24 * 7,
    valid: true,
    issued_tokens: 0,
    ...props,
  };
};

async function RefreshTokenFactory(props = {}, json = true) {
  const properties = await createProperties(props);
  const instance = await RefreshToken.create(properties);

  if (json) {
    return instance.toJSON();
  }

  return instance;
}

RefreshTokenFactory.findByAccountId = async (accountId, json = true) => {
  const instance = await RefreshToken.findOne({
    where: {
      account_id: accountId,
    },
  });

  if (instance && json) {
    return instance.toJSON();
  }

  return instance;
};

module.exports = RefreshTokenFactory;
