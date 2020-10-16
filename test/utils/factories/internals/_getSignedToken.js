const Constants = require('../../constants');
const Functions = require('../../functions');

function _getSignedToken(accountId) {
  return async (payload = {}, options = {}) => {
    options.secret = options.secret || Constants.JWT_SECRET;

    const token = Functions.createSignedToken(accountId, payload, options);

    return {
      access_token: token,
    };
  };
}

module.exports = _getSignedToken;
