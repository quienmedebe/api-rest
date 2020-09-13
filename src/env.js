/***
 * General application environment variables
 */
exports.PORT = process.env.PORT || '5000';
exports.APP_ENV = process.env.APP_ENV || 'development';
exports.COOKIES_SESSION_SECRET = process.env.COOKIES_SESSION_SECRET || 'SCRT_{C0oki3Sup3rS3Cr3t}';

/***
 * Rate limiter per second and ip configuration
 */
exports.OVERALL_REQUESTS_LIMIT = +process.env.OVERALL_REQUESTS_LIMIT || 10;

module.exports = exports;
