const Auth = require('../../modules/auth');
const Error = require('../../modules/error');

const Login = ({logger, config}) =>
  async function Login(req, res) {
    return Auth.passport.client.authenticate('local', {session: false}, (err, account) => {
      if (err || !account) {
        return Error.sendApiError(res, Error.API.UNAUTHORIZED);
      }

      const payload = {
        id: +account.id,
      };

      const options = {
        secret: config.TOKEN_SECRET,
        expiresIn: config.JWT_EXPIRATION_MS,
        logger: logger,
      };

      return Auth.functions.getAccessToken(req, res, payload, options);
    })(req, res);
  };

module.exports = Login;
