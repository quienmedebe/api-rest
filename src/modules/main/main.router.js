const express = require('express');

function createRouter({logger}) {
  const router = express.Router();

  router.get('/', function (_, res) {
    logger.log('info', 'A message from the route');
    res.status(200).json({
      working: true,
    });
  });

  return router;
}

module.exports = createRouter;
