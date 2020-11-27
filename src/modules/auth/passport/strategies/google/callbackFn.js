const Database = require('../../../../../database');

async function callbackFn(accessToken, refreshToken, profile, done) {
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

module.exports = callbackFn;
