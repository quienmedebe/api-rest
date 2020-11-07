const express = require('express');
const Shared = require('../../modules/shared');
const Middleware = require('../../middlewares');
const AddDebt = require('./AddDebt');

function DebtRouter({logger, config}) {
  const Router = express.Router();
  const wrapAsync = Shared.wrapAsync;

  Router.post('/', Middleware.JWT.requireAccessToken, wrapAsync(AddDebt({logger, config})));

  return Router;
}

module.exports = DebtRouter;
