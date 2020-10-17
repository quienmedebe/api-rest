const jwt = require('jsonwebtoken');
const Constants = require('../../constants');

function _getSignedToken(accountId) {
  return async (payload = {}, options = {}) => {
    const {secret = Constants.JWT_SECRET, expiresIn = 1000 * 60 * 5, ...jwtOptions} = options;

    const jwtPayload = {
      id: +accountId,
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

module.exports = _getSignedToken;
