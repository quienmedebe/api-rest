const jwt = require('jsonwebtoken');
const noopLogger = require('noop-logger');

function signToken(payload = {}, options = {}, config = {}) {
  const logger = config.logger || noopLogger;
  const secret = config.secret;

  const {id, ...jwtFields} = payload;
  const {expiresIn = 1000 * 60 * 5, ...jwtOptions} = options;

  if (!id || !secret) {
    logger('error', `Id: ${!!id}. Secret: ${!!secret}`);
    throw new Error('Invalid arguments');
  }

  const jwtPayload = {
    id,
    ...jwtFields,
  };

  const signOptions = {
    expiresIn: +expiresIn,
    ...jwtOptions,
  };

  const token = jwt.sign(jwtPayload, secret, signOptions);

  return token;
}

module.exports = function () {
  return module.exports.signToken.apply(this, arguments);
};
module.exports.signToken = signToken;
