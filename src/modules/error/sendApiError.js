const createErrorMessage = require('./internals/createErrorMessage');

function sendApiError(error, message, status) {
  return createErrorMessage(error, message, {status});
}

module.exports = sendApiError;
