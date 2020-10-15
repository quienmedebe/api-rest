const bcrypt = require('bcryptjs');
const faker = require('faker');
const isPlainObject = require('lodash.isplainobject');
const {EmailProvider} = require('../../../../src/database/models');
const Constants = require('../../constants');

async function _createEmailProvidersToAccount(emailConfig, accountId) {
  let providers = [
    {
      email: faker.internet.email(),
      password: Constants.PASSWORD,
    },
  ];

  if (isPlainObject(emailConfig)) {
    providers = [
      {
        email: emailConfig.email,
        password: emailConfig.password,
      },
    ];
  }

  if (Array.isArray(emailConfig)) {
    providers = emailConfig.map(({email, password}) => {
      return {
        email,
        password,
      };
    });
  }

  const providersPromises = providers.map(async ({email, password}) => {
    const provider = await EmailProvider.create({
      account_id: accountId,
      email,
      password: await bcrypt.hash(password, Constants.SALT_NUMBER),
    });

    provider.getToken = async requester => {
      const credentials = {
        email,
        password,
      };
      return await requester.post(`/auth/login`).send(credentials);
    };

    return provider;
  });

  const emailProviders = await Promise.all(providersPromises);

  return emailProviders;
}

module.exports = _createEmailProvidersToAccount;
