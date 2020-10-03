require('dotenv').config();

const environment = {
  ...process.env,
  /***
   * General application environment variables
   */
  PORT: process.env.PORT || '5000',
  APP_ENV: process.env.APP_ENV || 'development',
  COOKIES_SESSION_SECRET: process.env.COOKIES_SESSION_SECRET || 'SCRT_{C0oki3Sup3rS3Cr3t}',
  TOKEN_SECRET: process.env.TOKEN_SECRET || 'T0k3N*{S3CrEt_MAx1M-m_sECUR1T1}{',
  SALT_NUMBER: +process.env.SALT_NUMBER || 16,

  /***
   * REDIS CONFIGURATION
   */
  REDIS_HOST: process.env.REDIS_HOST || '127.0.0.1',
  REDIS_PORT: process.env.REDIS_PORT || '6379',

  /***
   * Database
   */
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD || null,

  DB_TEST_HOST: process.env.DB_TEST_HOST || 'localhost',
  DB_TEST_NAME: process.env.DB_TEST_NAME,
  DB_TEST_USER: process.env.DB_TEST_USER,
  DB_TEST_PASSWORD: process.env.DB_TEST_PASSWORD || null,

  /***
   * LOGGER CONFIGURATION
   */
  DISABLE_CONSOLE: !!+process.env.DISABLE_CONSOLE || false,
  ACTIVE_TEST_CONSOLE: !!+process.env.ACTIVE_TEST_CONSOLE || false,

  /***
   * Rate limiter per second and ip configuration
   */
  OVERALL_REQUESTS_LIMIT: +process.env.OVERALL_REQUESTS_LIMIT,
  OVERALL_REQUESTS_DURATION: +process.env.OVERALL_REQUESTS_DURATION >= 0 ? +process.env.OVERALL_REQUESTS_DURATION : 1,
};

module.exports = environment;
