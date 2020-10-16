const {useFakeXMLHttpRequest} = require('sinon');
const Auth = require('../../modules/auth');
const Error = require('../../modules/error');

const requireAccessToken = (req, res, next) => {
  return Auth.passport.client.authenticate(
    'jwt',
    {
      session: false,
    },
    (err, user) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return Error.sendApiError(res, Error.API.UNAUTHORIZED);
      }

      req.user = Auth.passport.serializeUser(user);
      return next(null, user);
    }
  )(req, res, next);
};

module.exports = requireAccessToken;
