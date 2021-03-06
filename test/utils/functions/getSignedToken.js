const jwt = require('jsonwebtoken');
const Constants = require('../constants');

function getSignedToken(accountPublicId) {
  return (payload = {}, options = {}) => {
    const {secret = Constants.ACCESS_TOKEN_SECRET, expiresIn = 1000 * 60 * 5, ...jwtOptions} = options;

    const jwtPayload = {
      id: accountPublicId,
      ...payload,
    };

    const signOptions = {
      expiresIn: +expiresIn,
      ...jwtOptions,
    };

    const token = jwt.sign(jwtPayload, secret, signOptions);

    return token;
  };
}

module.exports = getSignedToken;
