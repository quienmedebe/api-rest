function createErrorMessage(code, message, options = {}) {
  return {
    code,
    message,
    ...options,
  };
}

module.exports = createErrorMessage;
