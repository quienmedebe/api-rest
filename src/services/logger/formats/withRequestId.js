const winston = require('winston');

function withRequestId(reqId) {
  return winston.format(info => {
    info.requestId = reqId;

    return info;
  });
}

module.exports = withRequestId;
