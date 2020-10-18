const {RefreshToken} = require('../../../src/database/models');

const createProperties = async (props = {}) => {
  return {
    expiration_datetime: Date.now() + 1000 * 60 * 60 * 24 * 7,
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

module.exports = RefreshTokenFactory;
