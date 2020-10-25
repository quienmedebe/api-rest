require('dotenv').config();

const Email = require('./email');

const configuration = {
  ...process.env,
  /***
   * General configuration
   */
  PORT: process.env.PORT || '5000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  COOKIES_SESSION_SECRET: process.env.COOKIES_SESSION_SECRET || 'cookie_secret',
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || 'access_token_secret',
  SALT_NUMBER: +process.env.SALT_NUMBER || 16,
  ACCESS_TOKEN_EXPIRATION_SECONDS: +process.env.ACCESS_TOKEN_EXPIRATION_SECONDS || 15 * 60,
  REFRESH_TOKEN_EXPIRATION_MS: +process.env.REFRESH_TOKEN_EXPIRATION_MS || 2 * 24 * 60 * 60 * 1000,
  EMAIL_TOKEN_EXPIRATION_MS: +process.env.EMAIL_TOKEN_EXPIRATION_MS || 3 * 24 * 60 * 60 * 1000,

  /***
   * Database configuration
   */
  DB_URL: (['test'].includes(process.env.NODE_ENV) ? process.env.DB_URL_TEST : process.env.DB_URL) || 'postgresql://root@localhost:5432/db_dev',

  /***
   * Logger configuration
   */
  DISABLE_CONSOLE: Boolean(+process.env.DISABLE_CONSOLE) || false,

  /***
   * Mailjet configuration
   */
  MAILJET_CLIENT_ID: process.env.MAILJET_CLIENT_ID,
  MAILJET_SECRET: process.env.MAILJET_SECRET,

  /***
   * Modules
   */
  Email,
};

module.exports = configuration;
