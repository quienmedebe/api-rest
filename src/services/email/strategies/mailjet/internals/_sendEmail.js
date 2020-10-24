function sendEmail(client) {
  return async EmailContent => {
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

    return response;
  };
}

module.exports = sendEmail;
