const express = require('express');
const Ajv = require('ajv');
const ERRORS = require('../error');
const validation = require('./validation');
const functions = require('./auth.functions');

function createRouter({logger, env}) {
  const router = express.Router();

  router.post('/signup', async (req, res) => {
    logger.info('Start signup');

    const ajv = new Ajv({coerceTypes: true, removeAdditional: true, logger: logger});
    const requestSchema = {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        ...validation.emailPasswordSchema,
      },
    };
    const isValidRequest = ajv.validate(requestSchema, req.body);

    if (!isValidRequest) {
      return res.status(400).json(ERRORS.API.BAD_REQUEST);
    }

    const {email, password} = req.body;
    const options = {
      salt: env.SALT_NUMBER,
    };

    const response = await functions.createAccountFromEmailAndPassword(email, password, {}, options);

    return res.status(200).json(response);
  });

  return router;
}

module.exports = createRouter;
