const ERRORS = require('./errors');

function sendEmail(client, {logger, makeApiCall = true} = {}) {
  return async EmailContent => {
    try {
      const to = EmailContent.to.map(({email, ...props}) => ({Email: email, ...props}));
      const from = {
        Email: EmailContent.from.email,
        Name: EmailContent.from.name,
      };

      const requestBody = {
        Messages: [
          {
            From: from,
            To: to,
            Subject: EmailContent.subject,
            TextPart: EmailContent.text,
            HTMLPart: EmailContent.html,
            CustomID: EmailContent.customId,
          },
        ],
      };

      const response = await client.post('send', {version: 'v3.1', perform_api_call: makeApiCall}).request(requestBody);

      return response.Sent.map(({email}) => ({email}));
    } catch (error) {
      logger.log('error', 'Error sending the email', error);
      if (error.statusCode >= 500 && error.statusCode < 600) {
        return ERRORS.SERVICE_UNAVAILABLE;
      }

      const errorsPool = Object.values(ERRORS);
      const errorToSend = errorsPool.find(({status}) => status === error.statusCode);
      if (!errorToSend) {
        return ERRORS.SERVICE_UNAVAILABLE;
      }

      return errorToSend;
    }
  };
}

module.exports = sendEmail;
