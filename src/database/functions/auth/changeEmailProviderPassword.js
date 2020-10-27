const bcrypt = require('bcryptjs');
const {EmailProvider} = require('../../models');
const Shared = require('../../../modules/shared');

async function changeEmailProviderPassword(id, password, options = {}) {
  const {salt, ...opts} = options;
  if (!Shared.isNumber(salt)) {
    throw new Error('The salt must be a number');
  }

  if (!Shared.isNumber(id)) {
    throw new Error('The id must be a number');
  }

  const hashedPassword = await bcrypt.hash(password, salt);

  const updatedProvider = await EmailProvider.update(
    {
      password: hashedPassword,
    },
    {
      where: {
        id,
      },
      ...opts,
    }
  );

  return updatedProvider;
}

module.exports = changeEmailProviderPassword;
