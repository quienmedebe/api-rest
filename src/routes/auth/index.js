const express = require('express');
const Shared = require('../../modules/shared');
const Signup = require('./Signup');
const Login = require('./Login');

function AuthRouter({logger, config}) {
  const Router = express.Router();
  const wrapAsync = Shared.wrapAsync;

  Router.post('/signup', wrapAsync(Signup({logger, config})));
  Router.post('/login', wrapAsync(Login({config})));

  return Router;
}

module.exports = AuthRouter;
