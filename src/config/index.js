require('dotenv').config();

const Auth = require('./auth');
const Email = require('./email');
const Logger = require('./logger');
const Helpers = require('./helpers');

const configuration = {
  ...process.env,
  /***
   * General configuration
   */
  PORT: process.env.PORT || '5000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  COOKIES_SESSION_SECRET: process.env.COOKIES_SESSION_SECRET || 'cookie_secret',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',

  /***
   * Auth configuration
   */
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
   * Modules
   */
  Auth,
  Email,
  Logger,
  Helpers,
};

module.exports = configuration;
