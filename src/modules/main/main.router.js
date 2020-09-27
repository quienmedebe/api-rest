const express = require('express');
const ERRORS = require('../error');

function createRouter() {
  const router = express.Router();

  router.get('/unauthorized', (_, res) => {
    return res.status(401).json(ERRORS.API.UNAUTHORIZED);
  });

  return router;
}

module.exports = createRouter;
