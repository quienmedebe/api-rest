const ERROR = 'ERROR';

function sendResponse(status, payload, metadata = {}) {
  return {
    ...metadata,
    status,
    value: payload,
  };
}

sendResponse.OK = 'OK';
sendResponse.ERROR = ERROR;
sendResponse.isError = ({status}) => status === ERROR;

module.exports = sendResponse;
