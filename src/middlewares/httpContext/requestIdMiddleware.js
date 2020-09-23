const context = require('./context');
const Shared = require('../../modules/shared');

function requestIdMiddleware(req, res, next) {
  context.set('reqId', Shared.randomUUID());
  next();
}

module.exports = requestIdMiddleware;
