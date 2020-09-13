const createErrorMessage = require('./internals/createErrorMessage');

exports.TOO_MANY_REQUESTS = createErrorMessage('TOO_MANY_REQUESTS', 'Too many requests', {status: 429});
exports.RESOURCE_NOT_FOUND = createErrorMessage('RESOURCE_NOT_FOUND', 'Resource not found', {status: 404});

module.exports = exports;
