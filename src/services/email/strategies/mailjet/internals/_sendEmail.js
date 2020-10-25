const _errors = require('./_errors');

function sendEmail(client, options = {}) {
  const logger = options.logger || (() => {});

  return async EmailContent => {
    try {
      const response = await client.post('send', {version: 'v3.1'}).request({
        Messages: [
          {
            From: EmailContent.from,
            To: EmailContent.to,
            Subject: EmailContent.subject,
            TextPart: EmailContent.text,
            HTMLPart: EmailContent.html,
            CustomID: EmailContent.customId,
          },
        ],
      });

      return response.Sent.map(({email}) => ({email}));
    } catch (error) {
      logger.error(error);
      if (error.statusCode >= 500 && error.statusCode < 600) {
        return _errors.SERVICE_UNAVAILABLE;
      }

      const errorsPool = Object.values(_errors);
      const errorToSend = errorsPool.find(({status}) => status === error.statusCode);
      if (!errorToSend) {
        return _errors.SERVICE_UNAVAILABLE;
      }

      return errorToSend;
    }
  };
}

module.exports = sendEmail;
