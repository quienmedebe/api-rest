const Ajv = require('ajv');
const noopLogger = require('noop-logger');
const Auth = require('../../modules/auth');
const Errors = require('../../modules/errors');

const Refresh = ({logger = noopLogger, config}) =>
  async function Refresh(req, res) {
    const ajv = new Ajv({logger});
    const areValidParameters = ajv.validate(
      {
        type: 'object',
        required: ['accountId', 'refreshToken'],
        properties: {
          accountId: Auth.validation.accountPublicIdSchema,
          refreshToken: Auth.validation.refreshTokenSchema,
        },
      },
      req.body
    );

    if (!areValidParameters) {
      logger.info('Invalid arguments', {args: req.body});
      return Errors.sendApiError(res, Errors.API.BAD_REQUEST);
    }

    const {accountId, refreshToken} = req.body;

    const options = {
      secret: config.ACCESS_TOKEN_SECRET,
      expiresIn: config.ACCESS_TOKEN_EXPIRATION_SECONDS,
      logger: logger,
    };

    const accountPrivateId = await Auth.functions.getAccountPrivateIdFromPublicId(accountId);

    if (!accountPrivateId) {
      return Errors.sendApiError(res, Auth.errors.ACCOUNT_NOT_FOUND);
    }

    const response = await Auth.functions.getAccessTokenFromRefreshToken(accountPrivateId, refreshToken, options);

    if (response.error) {
      logger.info(response.error);
      return Errors.sendApiError(res, Errors.API.UNAUTHORIZED);
    }

    const credentialsResponse = {
      access_token: response.accessToken,
      refresh_token: refreshToken,
    };

    return res.status(200).json(credentialsResponse);
  };

module.exports = Refresh;
