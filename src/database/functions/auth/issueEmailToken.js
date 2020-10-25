const randToken = require('rand-token');
const {EmailToken} = require('../../models');

async function issueEmailToken(providerId, attributes = {}, options = {}) {
  const {expiresInMs} = attributes;

  const emailToken = await EmailToken.create(
    {
      id: randToken.uid(64),
      email_provider_id: providerId,
      valid: true,
      expiration_datetime: Date.now() + expiresInMs,
      times_used: 0,
    },
    options
  );

  return emailToken;
}

module.exports = issueEmailToken;
