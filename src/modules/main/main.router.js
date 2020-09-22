const express = require('express');
const {wrapAsync} = require('../shared');

function createRouter({logger}) {
  const router = express.Router();

  router.get(
    '/',
    wrapAsync(async function (_, res) {
      logger.log('info', 'A message from the route');

      res.status(200).json({
        // production: true,
        staged: true,
        develop: true,
      });
    })
  );

  return router;
}

module.exports = createRouter;
