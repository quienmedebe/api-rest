const Auth = require('../../modules/auth');
const Errors = require('../../modules/errors');

const Login = ({logger, config}) =>
  async function Login(req, res) {
    return await Auth.passport.client.authenticate('local', {session: false}, async (err, account) => {
      if (err || !account) {
        return Errors.sendApiError(res, Errors.API.UNAUTHORIZED);
      }

      const credentialOptions = {
        logger,
        accessTokenSecret: config.ACCESS_TOKEN_SECRET,
        accessTokenExpirationTime: config.ACCESS_TOKEN_EXPIRATION_MS,
        refreshTokenExpirationTime: config.REFRESH_TOKEN_EXPIRATION_MS,
      };

      const credentials = await Auth.functions.getCredentials(+account.id, credentialOptions);
      if (credentials.error) {
        return Errors.sendApiError(res, credentials);
      }

      const response = {
        access_token: credentials.accessToken,
        refresh_token: credentials.refreshToken,
      };

      return res.status(200).json(response);
    })(req, res);
  };

module.exports = Login;
