const express = require('express');
const Ajv = require('ajv');
const validation = require('./validation');
const functions = require('./auth.functions');
const errors = require('./auth.errors');
const Errors = require('../error');
const Shared = require('../shared');

function createRouter({logger, env}) {
  const router = express.Router();

  router.post(
    '/signup',
    Shared.wrapAsync(async (req, res) => {
      logger.info('Start signup');

      const {email, password} = req.body;

      const ajv = new Ajv({logger: logger});
      const isValidEmail = ajv.validate(validation.emailSchema, email);
      const isValidPassword = ajv.validate(validation.passwordSchema, password);

      if (!isValidEmail || !isValidPassword) {
        return res.status(400).json(Errors.API.BAD_REQUEST);
      }

      const options = {
        salt: env.SALT_NUMBER,
      };

      logger.info('Valid input data');

      const account = await functions.createAccountFromEmailAndPassword(email, password, {}, options);

      if (account.error) {
        switch (account.error) {
          case errors.DUPLICATE_EMAIL:
            return res.status(400).json(Errors.sendApiError(errors.DUPLICATE_EMAIL, 'The email already exists', 400));
          default:
            return res.status(400).json(Errors.API.BAD_REQUEST);
        }
      }

      logger.info('Account creation success');

      const response = account.data;

      return res.status(200).json(response);
    })
  );

  return router;
}

module.exports = createRouter;
