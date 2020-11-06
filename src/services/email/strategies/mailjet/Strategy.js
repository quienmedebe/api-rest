const Ajv = require('ajv');
const mailjet = require('node-mailjet');
const noopLogger = require('noop-logger');
const functions = require('./functions');

function MailJetStrategy(clientId, secret, {logger = noopLogger, makeApiCall} = {}) {
  const ajv = new Ajv({allErrors: true});
  const areValidCredentials = ajv.validate(
    {
      type: 'object',
      required: ['clientId', 'secret'],
      properties: {
        clientId: {
          type: 'string',
        },
        secret: {
          type: 'string',
        },
      },
    },
    {clientId, secret}
  );

  if (!areValidCredentials) {
    throw new Error('Invalid credentials');
  }

  const client = mailjet.connect(clientId, secret);

  return {
    sendEmail: functions.sendEmail(client, {logger, makeApiCall}),
  };
}

module.exports = MailJetStrategy;
