const winston = require('winston');

function createLogger(options = {}) {
  return winston.createLogger({
    ...options,
  });
}

module.exports = createLogger;
