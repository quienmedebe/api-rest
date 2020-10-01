const winston = require('winston');

const addRequestId = context => {
  return winston.format(info => {
    info.requestId = context.get('reqId');
    return info;
  });
};

function createHttpLogger(httpContext, {console = {}}) {
  return winston.createLogger({
    format: winston.format.combine(addRequestId(httpContext)(), winston.format.timestamp(), winston.format.json()),
    transports: [
      new winston.transports.Console({
        name: 'console',
        timestamp: true,
        ...console,
      }),
    ],
  });
}

module.exports = createHttpLogger;
