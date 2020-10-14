require('dotenv').config();

const defaults = require('./env.default');

const environment = {
  ...process.env,
  /***
   * General application environment variables
   */
  PORT: process.env.PORT || defaults.PORT,
  NODE_ENV: process.env.NODE_ENV || defaults.NODE_ENV,
  APP_ENV: process.env.APP_ENV || defaults.APP_ENV,
  COOKIES_SESSION_SECRET: process.env.COOKIES_SESSION_SECRET || defaults.COOKIES_SESSION_SECRET,
  TOKEN_SECRET: process.env.TOKEN_SECRET || defaults.TOKEN_SECRET,
  SALT_NUMBER: +process.env.SALT_NUMBER || defaults.SALT_NUMBER,
  JWT_EXPIRATION_MS: +process.env.JWT_EXPIRATION_MS || defaults.JWT_EXPIRATION_MS,

  /***
   * Database
   */
  DB_HOST: process.env.DB_HOST || defaults.DB_HOST,
  DB_NAME: process.env.DB_NAME || defaults.DB_NAME,
  DB_USER: process.env.DB_USER || defaults.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD || defaults.DB_PASSWORD,

  DB_TEST_HOST: process.env.DB_TEST_HOST || defaults.DB_TEST_HOST,
  DB_TEST_NAME: process.env.DB_TEST_NAME || defaults.DB_TEST_NAME,
  DB_TEST_USER: process.env.DB_TEST_USER || defaults.DB_TEST_USER,
  DB_TEST_PASSWORD: process.env.DB_TEST_PASSWORD || defaults.DB_TEST_PASSWORD,

  /***
   * LOGGER CONFIGURATION
   */
  DISABLE_CONSOLE: Boolean(+process.env.DISABLE_CONSOLE) || defaults.DISABLE_CONSOLE,
};

module.exports = environment;
