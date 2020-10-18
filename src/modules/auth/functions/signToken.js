const jwt = require('jsonwebtoken');
const noop = () => {};

function signToken(payload = {}, options = {}, config = {}) {
  const logger = config.logger || noop;
  const secret = config.secret;

  const {id, ...jwtFields} = payload;
  const {expiresIn = 1000 * 60 * 5, ...jwtOptions} = options;

  if (!id || !secret) {
    logger('error', `Id: ${!!id}. Secret: ${!!secret}`);
    throw new Error('Invalid arguments');
  }

  const jwtPayload = {
    id: +id,
    ...jwtFields,
  };

  const signOptions = {
    expiresIn: +expiresIn,
    ...jwtOptions,
  };

  const token = jwt.sign(jwtPayload, secret, signOptions);

  return token;
}

module.exports = signToken;
