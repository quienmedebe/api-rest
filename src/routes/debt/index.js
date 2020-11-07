const express = require('express');
const Shared = require('../../modules/shared');
const Middleware = require('../../middlewares');
const AddDebt = require('./AddDebt');
const RemoveDebt = require('./RemoveDebt');
const EditDebt = require('./EditDebt');

function DebtRouter({logger, config}) {
  const Router = express.Router();
  const wrapAsync = Shared.wrapAsync;

  Router.post('/', Middleware.JWT.requireAccessToken, wrapAsync(AddDebt({logger, config})));
  Router.delete('/:id', Middleware.JWT.requireAccessToken, wrapAsync(RemoveDebt({logger, config})));
  Router.patch('/:id', Middleware.JWT.requireAccessToken, wrapAsync(EditDebt({logger, config})));

  return Router;
}

module.exports = DebtRouter;
