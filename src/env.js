const env = {
  PORT: process.env.PORT || '5000',
  APP_ENV: process.env.APP_ENV || 'development',
  OVERALL_REQUESTS_LIMIT: +process.env.OVERALL_REQUESTS_LIMIT || 10,
};

module.exports = env;
