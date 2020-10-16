const jwt = require('jsonwebtoken');

function createSignedToken(accountId, payload = {}, options = {}) {
  const parsedPayload = {
    id: accountId,
    expires: Date.now() + parseInt(1000 * 60 * 5, 10),
    ...payload,
  };

  const token = jwt.sign(JSON.stringify(parsedPayload), options.secret);

  return token;
}

module.exports = createSignedToken;
