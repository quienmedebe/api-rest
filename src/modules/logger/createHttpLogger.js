const winston = require('winston');

const addRequestId = context =>
  winston.format(info => {
    info.requestId = context.get('reqId');
    return info;
  });

function createHttpLogger(httpContext) {
  return winston.createLogger({
    format: winston.format.combine(addRequestId(httpContext)(), winston.format.json()),
    transports: [new winston.transports.Console()],
  });
}

module.exports = createHttpLogger;
