/***
 * Logger configuration
 */
exports.DISABLE_CONSOLE = Boolean(+process.env.DISABLE_CONSOLE) || false;
exports.ACTIVE_TEST_CONSOLE = Boolean(+process.env.ACTIVE_TEST_CONSOLE) || false;

/***
 * Sentry configuration
 */
exports.LOGGER_USE_SENTRY = Boolean(+process.env.LOGGER_USE_SENTRY) || false;
exports.SENTRY_DSN = process.env.SENTRY_DSN;

/***
 * Loggly configuration
 */
exports.LOGGER_USE_LOGGLY = Boolean(+process.env.LOGGER_USE_LOGGLY) || false;
exports.LOGGLY_TOKEN = process.env.LOGGLY_TOKEN;
exports.LOGGLY_SUBDOMAIN = process.env.LOGGLY_SUBDOMAIN;

module.exports = exports;
