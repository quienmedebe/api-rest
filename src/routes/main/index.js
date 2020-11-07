const express = require('express');
const Error = require('../../modules/errors');

function MainRouter() {
  const Router = express.Router();

  Router.get('/unauthorized', (req, res) => {
    return Error.sendApiError(res, Error.API.UNAUTHORIZED);
  });

  return Router;
}

module.exports = MainRouter;
