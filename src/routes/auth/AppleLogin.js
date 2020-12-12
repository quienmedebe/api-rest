const noopLogger = require('noop-logger');
const Auth = require('../../modules/auth');

const AppleLogin = ({logger = noopLogger, config}) =>
  async function AppleLogin(req, res) {
    return await Auth.passport.client.authenticate('apple', {session: false}, async (err, account) => {
      if (err || !account) {
        logger.error(err);
        if (err === Auth.errors.APPLE_SIGN_IN.AuthorizationError.error) {
          return res.render('social-auth-error', {
            nonce: res.locals.cspNonce,
          });
        }
        if (err === Auth.errors.APPLE_SIGN_IN.TokenError.error) {
          return res.render('social-auth-error', {
            nonce: res.locals.cspNonce,
          });
        }

        return res.render('social-auth-error', {
          nonce: res.locals.cspNonce,
        });
      }

      const response = await Auth.functions.getAccessAndRefreshTokenFromAccountId(+account.id, {
        logger,
        accessTokenSecret: config.ACCESS_TOKEN_SECRET,
        accessTokenExpirationTimeSeconds: config.ACCESS_TOKEN_EXPIRATION_SECONDS,
        refreshTokenExpirationTimeMs: config.REFRESH_TOKEN_EXPIRATION_MS,
      });

      if (response.error) {
        return res.render('social-auth-error', {
          nonce: res.locals.cspNonce,
        });
      }

      return res.render('social-auth', {
        access_token: response.access_token,
        refresh_token: response.refresh_token,
        nonce: res.locals.cspNonce,
        source: config.CLIENT_URL,
      });
    })(req, res);
  };

module.exports = AppleLogin;
