const Ajv = require('ajv');
const Auth = require('../../modules/auth');
const Errors = require('../../modules/errors');

const NewPassword = ({config}) =>
  async function NewPassword(req, res) {
    const ajv = new Ajv({allErrors: true});
    const areValidArguments = ajv.validate(
      {
        type: 'object',
        required: ['emailProviderId', 'token', 'newPassword'],
        properties: {
          emailProviderId: Auth.validation.emailProviderIdSchema,
          token: Auth.validation.emailTokenSchema,
          newPassword: Auth.validation.passwordSchema,
        },
      },
      req.body
    );

    if (!areValidArguments) {
      return Errors.sendApiError(res, Errors.API.BAD_REQUEST);
    }

    const {emailProviderId, token, newPassword} = req.body;

    const changePasswordResponse = await Auth.functions.changePassword(emailProviderId, token, newPassword, {salt: config.SALT_NUMBER});
    if (changePasswordResponse.error) {
      return Errors.sendApiError(res, changePasswordResponse);
    }

    const response = {
      result: changePasswordResponse,
    };

    return res.status(200).json(response);
  };

module.exports = NewPassword;
