const {EmailProvider} = require('../../models');

const isEmailUnique = async (email, options = {}) => {
  const provider = await EmailProvider.findOne({
    where: {
      email,
    },
    ...options,
  });

  return !provider;
};

module.exports = isEmailUnique;
