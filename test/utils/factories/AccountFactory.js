const {Account} = require('../../../src/database/models');
const _getEmailProviderCreator = require('./internals/_getEmailProviderCreator');
const _includeEmailProvider = require('./internals/_includeEmailProvider');

const createProperties = async (props = {}, options = {}) => {
  const withEmail = await _getEmailProviderCreator(options.withEmail);

  return {
    ...withEmail,
    ...props,
  };
};

async function AccountFactory(props = {}, json = true, options = {}) {
  const withEmail = _includeEmailProvider(options.withEmail);

  const includeDetails = [...withEmail];

  const creationOptions = {};
  if (includeDetails.length) {
    creationOptions.include = includeDetails;
  }

  const properties = await createProperties(props, options);
  const instance = await Account.create(properties, creationOptions);

  if (json) {
    return instance.toJSON();
  }

  return instance;
}

module.exports = AccountFactory;
