const Ajv = require('ajv');
const mailjet = require('node-mailjet');
const _sendEmail = require('./internals/_sendEmail');

function MailJetStrategy(clientId, secret) {
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
    sendEmail: _sendEmail(client),
  };
}

module.exports = MailJetStrategy;
