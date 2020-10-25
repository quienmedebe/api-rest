const Ajv = require('ajv');
const validation = require('../validation');
const Errors = require('../errors');
const Database = require('../../../database');

async function changePassword(emailProviderId, token, password, options = {}) {
  const ajv = new Ajv({allErrors: true});
  const {salt} = options;

  const areParametersCorrect = ajv.validate(
    {
      type: 'object',
      required: ['emailProviderId', 'token', 'password', 'salt'],
      properties: {
        emailProviderId: validation.emailProviderIdSchema,
        token: validation.emailTokenSchema,
        password: validation.passwordSchema,
        salt: validation.saltSchema,
      },
    },
    {emailProviderId, token, password, salt}
  );

  if (!areParametersCorrect) {
    throw new Error('Invalid arguments');
  }

  const transaction = await Database.models.sequelize.transaction(async t => {
    const emailToken = await Database.functions.auth.getValidEmailToken(token, {emailProviderId, transaction: t});

    if (!emailToken) {
      return Errors.INVALID_EMAIL_TOKEN;
    }

    await Database.functions.auth.changeEmailProviderPassword(emailProviderId, password, {transaction: t, salt});

    emailToken.times_used += 1;
    emailToken.valid = false;

    await emailToken.save({transaction: t});

    return {
      success: true,
    };
  });

  return transaction;
}

module.exports = changePassword;
