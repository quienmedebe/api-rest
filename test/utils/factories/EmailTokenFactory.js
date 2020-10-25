const randToken = require('rand-token');
const {EmailToken} = require('../../../src/database/models');

const createProperties = async (props = {}) => {
  return {
    id: randToken.uid(64),
    email_provider_id: null,
    valid: true,
    expiration_datetime: Date.now() + 3 * 24 * 60 * 60 * 1000,
    times_used: 0,
    ...props,
  };
};

async function EmailTokenFactory(props = {}, json = true) {
  const properties = await createProperties(props);
  const instance = await EmailToken.create(properties);

  if (instance && json) {
    return instance.toJSON();
  }

  return instance;
}

EmailTokenFactory.findById = async (id, json = true) => {
  const instance = await EmailToken.findOne({
    where: {
      id,
    },
  });

  if (instance && json) {
    return instance.toJSON();
  }

  return instance;
};

module.exports = EmailTokenFactory;
