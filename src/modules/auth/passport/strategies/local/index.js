const LocalStrategy = require('passport-local').Strategy;
const callbackFn = require('./callbackFn');

const localStrategy = () => {
  return new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      session: false,
    },
    callbackFn
  );
};

module.exports = localStrategy;
