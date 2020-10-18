const Ajv = require('ajv');
const Auth = require('../../modules/auth');
const Error = require('../../modules/error');

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

    const account = await Auth.functions.createAccountFromEmailAndPassword(email, password, {}, signupOptions);

    if (account.error) {
      return Error.sendApiError(res, account);
    }

    const credentialOptions = {
      logger,
      accessTokenSecret: config.ACCESS_TOKEN_SECRET,
      accessTokenExpirationTime: config.ACCESS_TOKEN_EXPIRATION_MS,
      refreshTokenExpirationTime: config.REFRESH_TOKEN_EXPIRATION_MS,
    };
    const credentials = await Auth.functions.getCredentials(+account.id, credentialOptions);

    const response = {
      access_token: credentials.accessToken,
      refresh_token: credentials.refreshToken,
    };

    return res.status(200).json(response);
  };

module.exports = Signup;
