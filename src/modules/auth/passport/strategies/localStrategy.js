const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const {functions} = require('../../../database');

const localStrategy = name => {
  return new LocalStrategy(
    name,
    {
      usernameField: 'email',
      passwordField: 'password',
      session: false,
    },
    async (email, password, done) => {
      const account = await functions.getAccountFromEmail(email);

      if (!account) {
        return done(null, false);
      }

      const provider = account.email_providers && account.email_providers.find(provider => provider.email === email);
      if (!provider) {
        return done(null, false);
      }

      const isPasswordValid = await bcrypt.compare(password, provider.password);
      if (!isPasswordValid) {
        return done(null, false);
      }

      // The unique interesting part for the next requests is the account. I do not care about how the user logged in.
      // Also, it is a method to standarize all the strategies.
      const parsedAccount = {...account};
      delete parsedAccount.email_providers;

      return done(null, parsedAccount);
    }
  );
};

module.exports = localStrategy;
