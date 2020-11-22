const Ajv = require('ajv');
const noopLogger = require('noop-logger');
const Auth = require('../../modules/auth');
const Errors = require('../../modules/errors');

const Signup = ({logger = noopLogger, config}) =>
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
      logger.info('Invalid arguments', {args: '[SECRET]'});
      return Errors.sendApiError(res, Errors.API.BAD_REQUEST);
    }

    const {email, password} = req.body;
    const signupOptions = {
      salt: config.SALT_NUMBER,
    };

    const account = await Auth.functions.createAccountFromEmailAndPassword(email, password, {}, signupOptions);

    if (account.error) {
      logger.info(account.error);
      return Errors.sendApiError(res, account);
    }

    const response = await Auth.functions.getAccessAndRefreshTokenFromAccountId(+account.id, {
      logger,
      accessTokenSecret: config.ACCESS_TOKEN_SECRET,
      accessTokenExpirationTimeSeconds: config.ACCESS_TOKEN_EXPIRATION_SECONDS,
      refreshTokenExpirationTimeMs: config.REFRESH_TOKEN_EXPIRATION_MS,
    });

    if (response.error) {
      return Errors.sendApiError(res, response);
    }

    return res.status(200).json(response);
  };

module.exports = Signup;
