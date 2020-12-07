const {EmailProvider} = require('../../models');

async function getEmailProviderByPublicId(emailProviderId, options = {}) {
  const emailProvider = await EmailProvider.findOne({
    where: {
      public_id: emailProviderId,
    },
    ...options,
  });

  return emailProvider;
}

module.exports = getEmailProviderByPublicId;
