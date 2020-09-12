(exports.PORT = process.env.PORT || '5000'),
  (exports.APP_ENV = process.env.APP_ENV || 'development'),
  (exports.OVERALL_REQUESTS_LIMIT = +process.env.OVERALL_REQUESTS_LIMIT || 10),
  (module.exports = exports);
