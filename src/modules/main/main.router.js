const express = require('express');
const Error = require('../error');

function createRouter({logger}) {
  const router = express.Router();

  router.get('/unauthorized', (_, res) => {
    logger.info('Not authorized');

    return Error.sendApiError(res, Error.API.UNAUTHORIZED);
  });

  return router;
}

module.exports = createRouter;
