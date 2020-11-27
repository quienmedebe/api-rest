const Database = require('../../../../../database');

async function callbackFn(accessToken, refreshToken, decodedIdToken, profile, done) {
  try {
    // https://developer.apple.com/documentation/sign_in_with_apple/tokenresponse
    // https://developer.apple.com/documentation/sign_in_with_apple/sign_in_with_apple_rest_api/authenticating_users_with_sign_in_with_apple
    const account = await Database.functions.auth.createOrGetWithUpdateAccountFromAppleId(decodedIdToken.sub, decodedIdToken.email);

    return done(null, account.toJSON());
  } catch (err) {
    return done(err, false);
  }
}

module.exports = callbackFn;
