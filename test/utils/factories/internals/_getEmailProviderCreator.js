const faker = require('faker');
const bcrypt = require('bcryptjs');
const isPlainObject = require('lodash.isplainobject');
const Constants = require('../../constants');

async function _getEmailProviderCreator(withEmail) {
  if (withEmail) {
    let providers = [
      {
        email: faker.internet.email(),
        password: await bcrypt.hash(Constants.PASSWORD, Constants.SALT_NUMBER),
      },
    ];

    if (Array.isArray(withEmail)) {
      providers = withEmail;
    }

    if (isPlainObject(withEmail)) {
      providers = [withEmail];
    }

    return {
      email_providers: providers,
    };
  }

  return {};
}

module.exports = _getEmailProviderCreator;
