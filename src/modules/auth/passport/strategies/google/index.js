const google = require('passport-google-oauth20');
const GoogleStrategy = google.Strategy;
const callbackFn = require('./callbackFn');

const googleStrategy = ({clientId, clientSecret, callbackUrl} = {}) => {
  return new GoogleStrategy(
    {
      clientID: clientId,
      clientSecret: clientSecret,
      callbackURL: callbackUrl,
    },
    callbackFn
  );
};

module.exports = googleStrategy;
