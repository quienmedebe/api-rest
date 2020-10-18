require('dotenv').config();

const configuration = {
  ...process.env,
  /***
   * General configuration
   */
  PORT: process.env.PORT || '5000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  COOKIES_SESSION_SECRET: process.env.COOKIES_SESSION_SECRET || 'SCRT_{C0oki3Sup3rS3Cr3t}',
  TOKEN_SECRET: process.env.TOKEN_SECRET || 'T0k3N*{S3CrEt_MAx1M-m_sECUR1T1}{',
  SALT_NUMBER: +process.env.SALT_NUMBER || 16,
  JWT_EXPIRATION_MS: +process.env.JWT_EXPIRATION_MS || 15 * 60 * 1000, // 15 minutes by default

  /***
   * Database configuration
   */
  DB_URL: (['test'].includes(process.env.NODE_ENV) ? process.env.DB_URL_TEST : process.env.DB_URL) || 'postgresql://root@localhost:5432/db_dev',

  /***
   * Logger configuration
   */
  DISABLE_CONSOLE: Boolean(+process.env.DISABLE_CONSOLE) || false,
};

module.exports = configuration;
