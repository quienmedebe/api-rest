const {v4: uuidv4} = require('uuid');
const context = require('./context');

function requestIdMiddleware(req, res, next) {
  const requestId = uuidv4();
  context.set('reqId', requestId);
  next();
}

module.exports = requestIdMiddleware;
