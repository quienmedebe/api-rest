const {EmailProvider} = require('../../models');

const emailExists = async (email, options = {}) => {
  const provider = await EmailProvider.findOne({
    where: {
      email,
    },
    ...options,
  });

  return Boolean(provider);
};

module.exports = emailExists;
