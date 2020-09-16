require('dotenv').config();

const environment = {
  ...process.env,
  /***
   * General application environment variables
   */
  PORT: process.env.PORT || '5000',
  APP_ENV: process.env.APP_ENV || 'development',
  COOKIES_SESSION_SECRET: process.env.COOKIES_SESSION_SECRET || 'SCRT_{C0oki3Sup3rS3Cr3t}',

  /***
   * Rate limiter per second and ip configuration
   */
  OVERALL_REQUESTS_LIMIT: +process.env.OVERALL_REQUESTS_LIMIT >= 0 ? +process.env.OVERALL_REQUESTS_LIMIT : 0,
};

module.exports = environment;
