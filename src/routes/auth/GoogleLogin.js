const noopLogger = require('noop-logger');
const Auth = require('../../modules/auth');
const Errors = require('../../modules/errors');

const GoogleLogin = ({logger = noopLogger, config}) =>
  async function GoogleLogin(req, res) {
    return await Auth.passport.client.authenticate('google', {session: false}, async (err, account) => {
      console.log(err, account);
      // if (err || !account) {
      //   logger.error(err);
      //   return Errors.sendApiError(res, Errors.API.UNAUTHORIZED);
      // }

      // const credentialOptions = {
      //   logger,
      //   accessTokenSecret: config.ACCESS_TOKEN_SECRET,
      //   accessTokenExpirationTime: config.ACCESS_TOKEN_EXPIRATION_SECONDS,
      //   refreshTokenExpirationTime: config.REFRESH_TOKEN_EXPIRATION_MS,
      // };

      // const credentials = await Auth.functions.getCredentials(+account.id, credentialOptions);
      // if (credentials.error) {
      //   logger.info('Invalid credentials');
      //   return Errors.sendApiError(res, credentials);
      // }

      // const response = {
      //   access_token: credentials.accessToken,
      //   refresh_token: credentials.refreshToken,
      // };

      return res.status(200).json(account);
    })(req, res);
  };

module.exports = GoogleLogin;
