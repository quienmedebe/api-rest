const createErrorMessage = require('./internals/createErrorMessage');

exports.TOO_MANY_REQUESTS = createErrorMessage('TOO_MANY_REQUESTS', 'Too many requests', {status: 429});
exports.RESOURCE_NOT_FOUND = createErrorMessage('RESOURCE_NOT_FOUND', 'Resource not found', {status: 404});
exports.INTERNAL_SERVER_ERROR = createErrorMessage('INTERNAL_SERVER_ERROR', 'Internal server error', {status: 500});

module.exports = exports;
