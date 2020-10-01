const express = require('express');
const Ajv = require('ajv');
const ERRORS = require('../error');
const Shared = require('../shared');

function createRouter({logger}) {
  const router = express.Router();

  router.post('/signup', (req, res) => {
    logger.info('Start signup');

    const ajv = new Ajv({coerceTypes: true, removeAdditional: true});
    const requestSchema = {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          format: 'email',
          minLength: Shared.defs.AUTH.email.minLength,
          maxLength: Shared.defs.AUTH.email.maxLength,
        },
        password: {
          type: 'string',
          minLength: Shared.defs.AUTH.password.minLength,
          maxLength: Shared.defs.AUTH.password.maxLength,
        },
      },
    };
    const isValidRequest = ajv.validate(requestSchema, req.body);

    if (!isValidRequest) {
      return res.status(400).json(ERRORS.API.BAD_REQUEST);
    }

    const response = {};

    return res.status(200).json(response);
  });

  return router;
}

module.exports = createRouter;
