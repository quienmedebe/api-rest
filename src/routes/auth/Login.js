const Auth = require('../../modules/auth');
const Error = require('../../modules/error');

const Login = ({config}) =>
  async function Login(req, res) {
    const noSession = {session: false};
    return Auth.passport.client.authenticate('local', noSession, (err, account) => {
      if (err || !account) {
        return Error.sendApiError(res, Error.API.UNAUTHORIZED);
      }

      const payload = {
        id: account.id,
        expires: Date.now() + parseInt(config.JWT_EXPIRATION_MS, 10),
      };

      return req.login(payload, noSession, err => {
        if (err) {
          return Error.sendApiError(res, Error.API.UNAUTHORIZED);
        }

        const token = Auth.functions.signToken(payload, {secret: config.TOKEN_SECRET});

        const response = {
          access_token: token,
        };
        return res.status(200).json(response);
      });
    })(req, res);
  };

module.exports = Login;
