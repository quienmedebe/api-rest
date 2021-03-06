const {Account} = require('../../../src/database/models');
const _createEmailProvidersToAccount = require('./internals/_createEmailProvidersToAccount');

const createProperties = async (props = {}) => {
  return {
    ...props,
  };
};

async function AccountFactory(props = {}, json = true, options = {withEmail: true}) {
  const properties = await createProperties(props);
  const instance = await Account.create(properties);

  let emailProviders;
  if (options.withEmail) {
    emailProviders = await _createEmailProvidersToAccount(options.withEmail, instance.id, instance.public_id);
  }

  if (json) {
    const jsonModel = instance.toJSON();
    jsonModel.email_providers = emailProviders;
    return jsonModel;
  }

  instance.email_providers = emailProviders;
  return instance;
}

AccountFactory.findById = async (id, json = true) => {
  const instance = await Account.findOne({
    where: {
      id,
    },
  });

  if (instance && json) {
    return instance.toJSON();
  }

  return instance;
};

module.exports = AccountFactory;
