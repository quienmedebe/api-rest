const Ajv = require('ajv');
const noopLogger = require('noop-logger');
const Auth = require('../../modules/auth');
const Errors = require('../../modules/errors');

const NewPassword = ({logger = noopLogger, config}) =>
  async function NewPassword(req, res) {
    const ajv = new Ajv({allErrors: true});
    const areValidArguments = ajv.validate(
      {
        type: 'object',
        required: ['emailProviderId', 'token', 'newPassword'],
        properties: {
          emailProviderId: Auth.validation.emailProviderPublicIdSchema,
          token: Auth.validation.emailTokenSchema,
          newPassword: Auth.validation.passwordSchema,
        },
      },
      req.body
    );

    if (!areValidArguments) {
      logger.info('Invalid arguments', {args: {emailProviderId: req.body.emailProviderId, token: req.body.token}});
      return Errors.sendApiError(res, Errors.API.BAD_REQUEST);
    }

    const {emailProviderId, token, newPassword} = req.body;

    const emailProvider = await Auth.functions.getEmailProviderFromPublicId(emailProviderId);

    if (!emailProvider) {
      return Errors.sendApiError(res, Auth.errors.INVALID_EMAIL_TOKEN);
    }

    const changePasswordResponse = await Auth.functions.changePassword(+emailProvider.id, token, newPassword, {salt: config.SALT_NUMBER});
    if (changePasswordResponse.error) {
      logger.info(changePasswordResponse.error);
      return Errors.sendApiError(res, changePasswordResponse);
    }

    const response = {
      result: changePasswordResponse,
    };

    return res.status(200).json(response);
  };

module.exports = NewPassword;
