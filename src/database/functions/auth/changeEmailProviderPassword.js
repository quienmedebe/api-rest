const bcrypt = require('bcryptjs');
const {EmailProvider} = require('../../models');

async function changeEmailProviderPassword(id, password, options = {}) {
  const {salt, ...opts} = options;
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
