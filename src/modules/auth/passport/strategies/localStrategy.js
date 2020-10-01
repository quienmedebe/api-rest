const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const {functions} = require('../../../database');

const localStrategy = name =>
  new LocalStrategy(
    name,
    {
      usernameField: 'email',
      passwordField: 'password',
      session: false,
    },
    async (email, password, done) => {
      const provider = await functions.getAccountFromEmail(email);

      if (!provider) {
        return done(null, false);
      }

      const isPasswordValid = await bcrypt.compare(password, provider.password);
      if (!isPasswordValid) {
        return done(null, false);
      }

      const parsedProvider = {...provider};
      delete parsedProvider.password;

      return done(null, parsedProvider);
    }
  );

module.exports = localStrategy;
