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
  DB_URL: (['test'].includes(process.env.NODE_ENV) ? process.env.DB_URL_TEST : process.env.DB_URL) || defaults.DB_URL,

  /***
   * LOGGER CONFIGURATION
   */
  DISABLE_CONSOLE: Boolean(+process.env.DISABLE_CONSOLE) || defaults.DISABLE_CONSOLE,
};

module.exports = environment;
