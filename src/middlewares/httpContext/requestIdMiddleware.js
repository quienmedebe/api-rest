const {v4: uuidv4} = require('uuid');
const context = require('./context');

function requestIdMiddleware(req, res, next) {
  context.set('reqId', uuidv4());
  next();
}

module.exports = requestIdMiddleware;
