const google = require('passport-google-oauth20');
const GoogleStrategy = google.Strategy;
const Database = require('../../../../database');

const googleStrategy = ({clientId, clientSecret, callbackUrl} = {}) => {
  return new GoogleStrategy(
    {
      clientID: clientId,
      clientSecret: clientSecret,
      callbackURL: callbackUrl,
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        const accountResponse = await Database.functions.auth.getAccountFromGoogleId(profile.id);

        if (!accountResponse) {
          const account = await Database.functions.auth.createAccountFromGoogleId(profile.id);
          return done(null, account.toJSON());
        }

        return done(null, accountResponse.toJSON());
      } catch (err) {
        return done(err, false);
      }
    }
  );
};

module.exports = googleStrategy;
