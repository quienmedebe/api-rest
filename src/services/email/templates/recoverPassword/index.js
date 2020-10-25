const Ajv = require('ajv');
const validation = require('../../validation');
const createTextEmail = require('./createTextEmail');
const createHTMLEmail = require('./createHTMLEmail');

function RecoverPasswordTemplate(recoverPasswordUrl, emailConfig = {}) {
  const ajv = new Ajv({allErrors: true});

  const areValidArguments = ajv.validate(
    {
      type: 'object',
      required: ['recoverPasswordUrl', 'emailConfig'],
      properties: {
        recoverPasswordUrl: validation.url,
        emailConfig: {
          type: 'object',
          required: ['from', 'to', 'subject', 'customId'],
          properties: {
            from: validation.from,
            to: validation.to,
            subject: validation.subject,
            customId: validation.customId,
          },
        },
      },
    },
    {recoverPasswordUrl, emailConfig}
  );

  if (!areValidArguments) {
    throw new Error('Invalid arguments');
  }

  const {from, to, subject, customId} = emailConfig;

  return {
    from,
    to,
    subject,
    text: createTextEmail(recoverPasswordUrl),
    html: createHTMLEmail(recoverPasswordUrl),
    customId,
  };
}

module.exports = RecoverPasswordTemplate;
