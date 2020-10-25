const Ajv = require('ajv');
const Auth = require('../../modules/auth');
const Errors = require('../../modules/errors');
const Email = require('../../services/email');

const RecoverPassword = ({logger, config, email: emailService}) =>
  async function RecoverPassword(req, res) {
    const ajv = new Ajv({allErrors: true});
    const areValidArguments = ajv.validate(
      {
        type: 'object',
        required: ['email'],
        properties: {
          email: Auth.validation.emailSchema,
        },
      },
      req.body
    );

    if (!areValidArguments) {
      return Errors.sendApiError(res, Errors.API.BAD_REQUEST);
    }

    const {email} = req.body;

    const emailProviderWithTokens = await Auth.functions.getEmailProviderWithTokensFromEmail(email);
    const providerId = emailProviderWithTokens.id;
    let activeToken = emailProviderWithTokens.tokens && emailProviderWithTokens.tokens[0] && emailProviderWithTokens.tokens[0].id;
    if (!activeToken) {
      const newToken = await Auth.functions.createEmailToken(emailProviderWithTokens.id, {expiresInMs: config.EMAIL_TOKEN_EXPIRATION_MS});

      activeToken = newToken.id;
    }

    const recoverPasswordUrl = `${config.RECOVER_PASSWORD_URL}/${providerId}/${activeToken}`;
    const emailContent = Email.templates.RecoverPassword(recoverPasswordUrl, {
      from: config.Email.RECOVER_PASSWORD_FROM,
      to: [
        {
          email,
        },
      ],
      subject: config.Email.RECOVER_PASSWORD_SUBJECT,
      customId: config.Email.RECOVER_PASSWORD_ID,
    });
    const emails = await emailService.sendEmail(emailContent);

    const response = {
      result: emails,
    };

    return res.status(200).json(response);
  };

module.exports = RecoverPassword;
