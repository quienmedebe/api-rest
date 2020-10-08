const winston = require('winston');
const createLogger = require('../createLogger');
const Formats = require('../formats');
const Transports = require('../transports');

function defaultLogger(reqId, options = {}) {
  const consoleOptions = options.consoleOptions || {};

  return createLogger({
    format: winston.format.combine(Formats.withRequestId(reqId)(), winston.format.timestamp(), winston.format.json()),
    transports: [
      Transports.Console({
        timestamp: true,
        ...consoleOptions,
      }),
    ],
  });
}

module.exports = defaultLogger;
