const AppleStrategy = require('passport-apple');

const Database = require('../../../../database');

const appleStrategy = ({clientId, teamId, callbackUrl, keyId, privateKeyLocation} = {}) => {
  return new AppleStrategy(
    {
      clientID: clientId,
      teamID: teamId,
      callbackURL: callbackUrl,
      keyID: keyId,
      privateKeyLocation: privateKeyLocation,
    },
    async function (accessToken, refreshToken, decodedIdToken, profile, done) {
      try {
        console.log('-'.repeat(10));
        console.log(accessToken);
        console.log(refreshToken);
        console.log(decodedIdToken);
        console.log(profile);
        console.log('-'.repeat(10));
        // Here, check if the decodedIdToken.sub exists in your database!
        // decodedIdToken should contains email too if user authorized it but will not contain the name
        // `profile` parameter is REQUIRED for the sake of passport implementation
        // it should be profile in the future but apple hasn't implemented passing data
        // in access token yet https://developer.apple.com/documentation/sign_in_with_apple/tokenresponse

        return done(null, false);
      } catch (err) {
        return done(err, false);
      }
    }
  );
};

module.exports = appleStrategy;
