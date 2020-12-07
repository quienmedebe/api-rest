const Database = require('../../../database');

async function getEmailProviderFromPublicId(emailProviderPublicId, options = {}) {
  const emailProvider = await Database.functions.auth.getEmailProviderByPublicId(emailProviderPublicId, options);

  return emailProvider;
}

module.exports = getEmailProviderFromPublicId;
