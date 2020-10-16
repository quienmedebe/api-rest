const faker = require('faker');
const bcrypt = require('bcryptjs');
const {EmailProvider} = require('../../../src/database/models');
const Constants = require('../constants');

const createProperties = async (props = {}) => {
  const {password, ...fields} = props;
  let providerPassword;
  if (password) {
    providerPassword = await bcrypt.hash(Constants.PASSWORD, Constants.SALT_NUMBER);
  } else {
    providerPassword = await bcrypt.hash(props.password, Constants.SALT_NUMBER);
  }

  return {
    email: faker.internet.email(),
    password: providerPassword,
    ...fields,
  };
};

async function EmailProviderFactory(props = {}, json = true) {
  const properties = await createProperties(props);
  const instance = await EmailProvider.create(properties);

  if (json) {
    return instance.toJSON();
  }

  return instance;
}

module.exports = EmailProviderFactory;
