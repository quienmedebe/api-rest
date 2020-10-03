function createErrorMessage(error, message, options = {}) {
  return {
    error,
    message,
    ...options,
  };
}

module.exports = createErrorMessage;
