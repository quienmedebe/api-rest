const express = require('express');
const Shared = require('../../modules/shared');
const Middleware = require('../../middlewares');
const Signup = require('./Signup');
const Login = require('./Login');
const Check = require('./Check');
const Refresh = require('./Refresh');
const RecoverPassword = require('./RecoverPassword');

function AuthRouter({logger, config}) {
  const Router = express.Router();
  const wrapAsync = Shared.wrapAsync;

  Router.post('/signup', wrapAsync(Signup({logger, config})));
  Router.post('/login', wrapAsync(Login({logger, config})));
  Router.get('/check', Middleware.JWT.requireAccessToken, wrapAsync(Check()));
  Router.post('/refresh', wrapAsync(Refresh({logger, config})));
  Router.post('/recover-password', wrapAsync(RecoverPassword({logger, config})));

  return Router;
}

module.exports = AuthRouter;
