const winston = require('winston');

function console(options = {}) {
  return new winston.transports.Console({
    timestamp: true,
    ...options,
  });
}

module.exports = console;
