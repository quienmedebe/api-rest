const createErrorMessage = (code, message, options = {}) => {
  return {
    code,
    message,
    ...options,
  };
};

module.exports = createErrorMessage;
