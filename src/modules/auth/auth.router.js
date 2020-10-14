const express = require('express');
const Ajv = require('ajv');
const validation = require('./validation');
const functions = require('./auth.functions');
const passport = require('./passport');
const errors = require('./auth.errors');
const Error = require('../error');
const Shared = require('../shared');

function createRouter({logger, env}) {
  const router = express.Router();

  router.post(
    '/signup',
    Shared.wrapAsync(async (req, res) => {
      const {email, password} = req.body;

      const ajv = new Ajv({logger});
      const isValidEmail = ajv.validate(validation.emailSchema, email);
      const isValidPassword = ajv.validate(validation.passwordSchema, password);

      if (!isValidEmail || !isValidPassword) {
        return Error.sendApiError(res, Error.API.BAD_REQUEST);
      }

      const options = {
        salt: env.SALT_NUMBER,
      };

      const account = await functions.createAccountFromEmailAndPassword(email, password, {}, options);

      if (account.error) {
        switch (account.error) {
          case errors.DUPLICATE_EMAIL.error:
            return Error.sendApiError(res, errors.DUPLICATE_EMAIL);
          default:
            return Error.sendApiError(res, Error.API.BAD_REQUEST);
        }
      }

      const payload = {
        id: account.data.id,
        expires: Date.now() + parseInt(env.JWT_EXPIRATION_MS, 10),
      };
      const noSession = {session: false};

      return req.login(payload, {...noSession}, err => {
        if (err) {
          return Error.sendApiError(res, Error.API.UNAUTHORIZED);
        }

        const token = functions.signToken(payload, {secret: env.TOKEN_SECRET});

        const response = {
          access_token: token,
        };

        return res.status(200).json(response);
      });
    })
  );

  router.post(
    '/login',
    Shared.wrapAsync((req, res) => {
      const noSession = {session: false};
      return passport.client.authenticate('local', noSession, (err, account) => {
        if (err || !account) {
          return Error.sendApiError(res, Error.API.UNAUTHORIZED);
        }

        const payload = {
          id: account.id,
          expires: Date.now() + parseInt(env.JWT_EXPIRATION_MS, 10),
        };

        return req.login(payload, noSession, err => {
          if (err) {
            return Error.sendApiError(res, Error.API.UNAUTHORIZED);
          }

          const token = functions.signToken(payload, {secret: env.TOKEN_SECRET});

          const response = {
            access_token: token,
          };
          return res.status(200).json(response);
        });
      })(req, res);
    })
  );

  return router;
}

module.exports = createRouter;
