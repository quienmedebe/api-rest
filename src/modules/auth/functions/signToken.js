const jwt = require('jsonwebtoken');
const noop = () => {};

const signToken = (payload = {}, options = {}) => {
  const logger = options.logger || noop;
  const secret = options.secret;
  const {id, expires} = payload;

  if (!id || !expires || !secret) {
    logger('error', `Id: ${!!id}. Expires: ${!!expires}. Secret: ${!!secret}`);
    throw new Error('Invalid arguments');
  }

  const token = jwt.sign(JSON.stringify(payload), secret);

  logger('info', 'Return token');
  return token;
};

module.exports = signToken;
