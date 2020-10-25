const Database = require('../../../database');

async function getEmailProviderWithTokensFromEmail(email, options = {}) {
  const emailProvider = await Database.functions.auth.getEmailProviderWithValidTokensFromEmail(email, options);

  return emailProvider;
}

module.exports = getEmailProviderWithTokensFromEmail;
