const Ajv = require('ajv');
const Database = require('../../../database');
const validation = require('../validation');

async function createEmailToken(emailProviderId, options = {}) {
  const ajv = new Ajv({allErrors: true});
  const areValidParameters = ajv.validate(
    {
      type: 'object',
      required: ['emailProviderId'],
      properties: {
        emailProviderId: validation.emailProviderIdSchema,
        options: {
          type: 'object',
          properties: {
            expiresInMs: validation.expiresInMsSchema,
          },
        },
      },
    },
    {emailProviderId, options}
  );

  if (!areValidParameters) {
    throw new Error('Invalid arguments');
  }

  const {expiresInMs, ...opts} = options;

  const emailToken = await Database.functions.auth.issueEmailToken(emailProviderId, {expiresInMs}, opts);

  return emailToken;
}

module.exports = createEmailToken;
