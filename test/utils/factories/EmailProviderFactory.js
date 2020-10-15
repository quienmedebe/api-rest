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

  const password = props.password || Constants.PASSWORD;
  instance.getToken = async requester => {
    const credentials = {
      email: instance.email,
      password,
    };
    return await requester.post(`/auth/login`).send(credentials);
  };

  if (json) {
    return instance.toJSON();
  }

  return instance;
}

module.exports = EmailProviderFactory;
