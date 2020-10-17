const Ajv = require('ajv');
const Auth = require('../../modules/auth');
const Error = require('../../modules/error');
const Shared = require('../../modules/shared');

const Signup = ({logger, config}) =>
  async function Signup(req, res) {
    const {email, password} = req.body;

    const ajv = new Ajv({logger});
    const isValidEmail = ajv.validate(Auth.validation.emailSchema, email);
    const isValidPassword = ajv.validate(Auth.validation.passwordSchema, password);

    if (!isValidEmail || !isValidPassword) {
      return Error.sendApiError(res, Error.API.BAD_REQUEST);
    }

    const signupOptions = {
      salt: config.SALT_NUMBER,
    };

    const response = await Auth.functions.createAccountFromEmailAndPassword(email, password, {}, signupOptions);

    if (Shared.sendResponse.isError(response)) {
      switch (response.value) {
        case Auth.errors.DUPLICATE_EMAIL.error:
          return Error.sendApiError(res, Auth.errors.DUPLICATE_EMAIL);
        default:
          return Error.sendApiError(res, Error.API.BAD_REQUEST);
      }
    }

    const account = response.value;

    const payload = {
      id: parseInt(account.id, 10),
    };

    const loginOptions = {
      secret: config.TOKEN_SECRET,
      expiresIn: config.JWT_EXPIRATION_MS,
    };

    return Auth.functions.getAccessToken(req, res, payload, loginOptions);
  };

module.exports = Signup;
