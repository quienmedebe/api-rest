const winston = require('winston');

const addRequestId = context => {
  return winston.format(info => {
    info.requestId = context.get('reqId');
    return info;
  });
};

function createHttpLogger(httpContext) {
  return winston.createLogger({
    format: winston.format.combine(addRequestId(httpContext)(), winston.format.timestamp(), winston.format.json()),
    transports: [
      new winston.transports.Console({
        timestamp: true,
      }),
    ],
  });
}

module.exports = createHttpLogger;
