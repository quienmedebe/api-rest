const Ajv = require('ajv');
const Auth = require('../../modules/auth');
const Errors = require('../../modules/errors');

const Signup = ({logger, config}) =>
  async function Signup(req, res) {
    const ajv = new Ajv({logger});
    const areValidArguments = ajv.validate(
      {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: Auth.validation.emailSchema,
          password: Auth.validation.passwordSchema,
        },
      },
      req.body
    );

    if (!areValidArguments) {
      logger.log('info', 'Invalid arguments', {args: req.body});
      return Errors.sendApiError(res, Errors.API.BAD_REQUEST);
    }

    const {email, password} = req.body;
    const signupOptions = {
      salt: config.SALT_NUMBER,
    };

    const account = await Auth.functions.createAccountFromEmailAndPassword(email, password, {}, signupOptions);

    if (account.error) {
      logger.log('info', account.error);
      return Errors.sendApiError(res, account);
    }

    const credentialOptions = {
      logger,
      accessTokenSecret: config.ACCESS_TOKEN_SECRET,
      accessTokenExpirationTime: config.ACCESS_TOKEN_EXPIRATION_SECONDS,
      refreshTokenExpirationTime: config.REFRESH_TOKEN_EXPIRATION_MS,
    };
    const credentials = await Auth.functions.getCredentials(+account.id, credentialOptions);

    if (credentials.error) {
      logger.log('info', credentials.error);
      return Errors.sendApiError(res, credentials);
    }

    const response = {
      access_token: credentials.accessToken,
      refresh_token: credentials.refreshToken,
    };

    return res.status(200).json(response);
  };

module.exports = Signup;
