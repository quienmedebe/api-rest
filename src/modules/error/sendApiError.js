const createErrorMessage = require('./internals/createErrorMessage');

function sendApiError(res, {error, message, status}) {
  const payload = createErrorMessage(error, message, status);

  return res.status(status).json(payload);
}

module.exports = sendApiError;
