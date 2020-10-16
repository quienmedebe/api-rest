const express = require('express');
const Shared = require('../../modules/shared');
const Signup = require('./Signup');
const Login = require('./Login');
const Check = require('./Check');
const Middleware = require('../../middlewares');

function AuthRouter({logger, config}) {
  const Router = express.Router();
  const wrapAsync = Shared.wrapAsync;

  Router.post('/signup', wrapAsync(Signup({logger, config})));
  Router.post('/login', wrapAsync(Login({config})));
  Router.get('/check', Middleware.JWT.requireAccessToken, wrapAsync(Check()));

  return Router;
}

module.exports = AuthRouter;
