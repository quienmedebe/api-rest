const express = require('express');
const Error = require('../../modules/error');

function MainRouter() {
  const Router = express.Router();

  Router.get('/unauthorized', (_, res) => {
    return Error.sendApiError(res, Error.API.UNAUTHORIZED);
  });

  return Router;
}

module.exports = MainRouter;
