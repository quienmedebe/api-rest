const Ajv = require('ajv');
const Auth = require('../../modules/auth');
const Errors = require('../../modules/errors');

const Refresh = ({logger, config}) =>
  async function Refresh(req, res) {
    const {accountId, refreshToken} = req.body;

    const ajv = new Ajv({logger});
    const isValidAccountId = ajv.validate(Auth.validation.accountIdSchema, accountId);
    const isValidRefreshToken = ajv.validate(Auth.validation.refreshTokenSchema, refreshToken);

    if (!isValidAccountId || !isValidRefreshToken) {
      return Errors.sendApiError(res, Errors.API.BAD_REQUEST);
    }

    const options = {
      secret: config.ACCESS_TOKEN_SECRET,
      expiresIn: config.ACCESS_TOKEN_EXPIRATION_MS,
      logger: logger,
    };

    const response = await Auth.functions.getAccessTokenFromRefreshToken(accountId, refreshToken, options);

    if (response.error) {
      return Errors.sendApiError(res, Errors.API.UNAUTHORIZED);
    }

    const credentialsResponse = {
      access_token: response.accessToken,
      refresh_token: refreshToken,
    };

    return res.status(200).json(credentialsResponse);
  };

module.exports = Refresh;
