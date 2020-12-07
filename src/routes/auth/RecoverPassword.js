const Ajv = require('ajv');
const noopLogger = require('noop-logger');
const Auth = require('../../modules/auth');
const Errors = require('../../modules/errors');
const Email = require('../../services/email');

const RecoverPassword = ({logger = noopLogger, config}) =>
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
      logger.info('Invalid arguments', {args: req.body});
      return Errors.sendApiError(res, Errors.API.BAD_REQUEST);
    }

    const {email} = req.body;

    const emailProviderWithTokens = await Auth.functions.getEmailProviderWithTokensFromEmail(email);
    if (!emailProviderWithTokens) {
      logger.info(Auth.errors.EMAIL_NOT_FOUND);
      return Errors.sendApiError(res, Auth.errors.EMAIL_NOT_FOUND);
    }
    const providerId = +emailProviderWithTokens.id;
    const providerPublicId = emailProviderWithTokens.public_id;

    let activeToken = emailProviderWithTokens.tokens && emailProviderWithTokens.tokens[0] && emailProviderWithTokens.tokens[0].id;
    if (!activeToken) {
      const newToken = await Auth.functions.createEmailToken(providerId, {expiresInMs: config.EMAIL_TOKEN_EXPIRATION_MS});

      activeToken = newToken.id;
    }

    const recoverPasswordUrl = `${config.RECOVER_PASSWORD_URL}/${providerPublicId}/${activeToken}`;
    const emailContent = Email.templates.RecoverPassword(recoverPasswordUrl, {
      from: {
        email: config.Email.RECOVER_PASSWORD_FROM_EMAIL,
        name: config.Email.RECOVER_PASSWORD_FROM_NAME,
      },
      to: [
        {
          email,
        },
      ],
      subject: config.Email.RECOVER_PASSWORD_SUBJECT,
      customId: config.Email.RECOVER_PASSWORD_ID,
    });
    const emailService = Email.getClient();
    const emails = await emailService.sendEmail(emailContent);
    const response = {
      result: emails,
    };

    return res.status(200).json(response);
  };

module.exports = RecoverPassword;
