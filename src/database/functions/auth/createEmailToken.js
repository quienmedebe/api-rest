const randToken = require('rand-token');
const {EmailToken} = require('../../models');

async function createEmailToken(providerId, attributes = {}, options = {}) {
  const {valid, expiresInMs, usedTimes, ...attr} = attributes;

  const emailToken = await EmailToken.create(
    {
      id: randToken.uid(64),
      email_provider_id: providerId,
      valid: typeof valid === 'undefined' ? true : valid,
      expiration_datetime: Date.now() + expiresInMs,
      times_used: usedTimes ? usedTimes : 0,
      ...attr,
    },
    options
  );

  return emailToken;
}

module.exports = createEmailToken;
