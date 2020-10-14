const createErrorMessage = require('./internals/createErrorMessage');

exports.BAD_REQUEST = createErrorMessage('BAD_REQUEST', 'Invalid parameters', 400);
exports.UNAUTHORIZED = createErrorMessage('UNAUTHORIZED', 'Invalid credentials', 401);
exports.RESOURCE_NOT_FOUND = createErrorMessage('RESOURCE_NOT_FOUND', 'Resource not found', 404);
exports.TOO_MANY_REQUESTS = createErrorMessage('TOO_MANY_REQUESTS', 'Too many requests', 429);
exports.INTERNAL_SERVER_ERROR = createErrorMessage('INTERNAL_SERVER_ERROR', 'Internal server error', 500);

module.exports = exports;
