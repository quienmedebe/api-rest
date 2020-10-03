const createErrorMessage = require('./internals/createErrorMessage');

function sendApiError(code, message, status) {
  return createErrorMessage(code, message, {status});
}

module.exports = sendApiError;
