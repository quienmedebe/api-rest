const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const Database = require('../../../database');

const localStrategy = () => {
  return new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      session: false,
    },
    async (email, password, done) => {
      try {
        const account = await Database.functions.auth.getAccountFromEmail(email);

        if (!account) {
          return done(null, false);
        }

        const parsedAccount = account.toJSON();

        const provider = parsedAccount.email_providers && parsedAccount.email_providers.find(provider => provider.email === email);
        if (!provider) {
          return done(null, false);
        }

        const isPasswordValid = await bcrypt.compare(password, provider.password);
        if (!isPasswordValid) {
          return done(null, false);
        }

        // The interesting part for the next requests is the account. I do not care about how the user logged in.
        // Also, it is a method to standarize the result of all the strategies.
        const response = {...parsedAccount};
        delete response.email_providers;

        return done(null, response);
      } catch (err) {
        return done(err, false);
      }
    }
  );
};

module.exports = localStrategy;
