const winston = require('winston');

function withRequestId(getRequestId) {
  return winston.format(info => {
    info.requestId = getRequestId();

    return info;
  });
}

module.exports = withRequestId;
