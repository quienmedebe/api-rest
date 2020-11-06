// https://dev.mailjet.com/email/reference/overview/errors/

exports.BAD_REQUEST = {error: 'BAD_REQUEST', message: 'One or more parameters are missing or maybe misspelled (unknown resource or action).', status: 400};
exports.UNAUTHORIZED = {
  error: 'UNAUTHORIZED',
  message:
    'You have specified an incorrect API Key / API Secret Key pair. You may be unauthorized to access the API or your API key may be inactive. Visit API keys Management (https://app.mailjet.com/account/api_keys) section to check your keys.',
  status: 401,
};
exports.FORBIDDEN = {error: 'FORBIDDEN', message: 'You are not authorized to access this resource', status: 403};
exports.NOT_FOUND = {error: 'NOT_FOUND', message: 'The resource with the specified ID you are trying to reach does not exist.', status: 404};
exports.METHOD_NOT_ALLOWED = {error: 'METHOD_NOT_ALLOWED', message: 'The method requested on the resource does not exist.', status: 405};
exports.TOO_MANY_REQUESTS = {
  error: 'TOO_MANY_REQUESTS',
  message:
    'Oops! You have reached the maximum number of calls allowed per minute by our API. Please review your integration to reduce the number of calls issued by your system.',
  status: 429,
};

/***
 * Server error (5xx) of the dependency should return a Service Unavailable error
 * https://stackoverflow.com/a/25398605/13559862
 */
exports.SERVICE_UNAVAILABLE = {
  error: 'SERVICE_UNAVAILABLE',
  message:
    'Ouch! Something went wrong on our side and we apologize! When such error occurs, it will contain an error identifier in its description (e.g. "ErrorIdentifier" : "D4DF574C-0C5F-45C7-BA52-7AA8E533C3DE"), which is crucial for us to track the problem and identify the root cause. Please contact our support team, providing the error identifier and we will do our best to help.',
  status: 503,
};

module.exports = exports;
