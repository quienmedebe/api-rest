function createErrorMessage(error, message, status, options = {}) {
  return {
    error,
    message,
    status,
    ...options,
  };
}

module.exports = createErrorMessage;
