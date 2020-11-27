const AppleStrategy = require('passport-apple');

const callbackFn = require('./callbackFn');

const appleStrategy = ({clientId, teamId, callbackUrl, keyId, privateKeyLocation} = {}) => {
  return new AppleStrategy(
    {
      clientID: clientId,
      teamID: teamId,
      callbackURL: callbackUrl,
      keyID: keyId,
      privateKeyLocation: privateKeyLocation,
    },
    callbackFn
  );
};

module.exports = appleStrategy;
