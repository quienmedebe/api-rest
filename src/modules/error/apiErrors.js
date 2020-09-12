const createErrorMessage = require('./internals/createErrorMessage');

exports.TOO_MANY_REQUESTS = createErrorMessage('TOO_MANY_REQUESTS', 'Too many requests', {status: 429});

module.exports = exports;
