const express = require('express');
const Ajv = require('ajv');
const Auth = require('../../modules/auth');
const Error = require('../../modules/error');
const Shared = require('../../modules/shared');

function AuthRouter({logger, config}) {
  const Router = express.Router();
  const wrapAsync = Shared.wrapAsync;

  Router.post(
    '/signup',
    wrapAsync(async (req, res) => {
      const {email, password} = req.body;

      const ajv = new Ajv({logger});
      const isValidEmail = ajv.validate(Auth.validation.emailSchema, email);
      const isValidPassword = ajv.validate(Auth.validation.passwordSchema, password);

      if (!isValidEmail || !isValidPassword) {
        return Error.sendApiError(res, Error.API.BAD_REQUEST);
      }

      const options = {
        salt: config.SALT_NUMBER,
      };

      const account = await Auth.functions.createAccountFromEmailAndPassword(email, password, {}, options);

      if (account.error) {
        switch (account.error) {
          case Auth.errors.DUPLICATE_EMAIL.error:
            return Error.sendApiError(res, Auth.errors.DUPLICATE_EMAIL);
          default:
            return Error.sendApiError(res, Error.API.BAD_REQUEST);
        }
      }

      const payload = {
        id: account.data.id,
        expires: Date.now() + parseInt(config.JWT_EXPIRATION_MS, 10),
      };
      const noSession = {session: false};

      return req.login(payload, {...noSession}, err => {
        if (err) {
          return Error.sendApiError(res, Error.API.UNAUTHORIZED);
        }

        const token = Auth.functions.signToken(payload, {secret: config.TOKEN_SECRET});

        const response = {
          access_token: token,
        };

        return res.status(200).json(response);
      });
    })
  );

  Router.post(
    '/login',
    wrapAsync((req, res) => {
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
    })
  );

  return Router;
}

module.exports = AuthRouter;
