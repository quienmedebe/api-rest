module.exports = {
  PORT: '5000',
  NODE_ENV: 'development',
  APP_ENV: 'development',
  COOKIES_SESSION_SECRET: 'SCRT_{C0oki3Sup3rS3Cr3t}',
  TOKEN_SECRET: 'T0k3N*{S3CrEt_MAx1M-m_sECUR1T1}{',
  SALT_NUMBER: 16,
  JWT_EXPIRATION_MS: 15 * 60 * 1000, // 15 minutes by default

  REDIS_HOST: '127.0.0.1',
  REDIS_PORT: '6379',

  DB_HOST: 'localhost',
  DB_NAME: 'db_dev',
  DB_USER: 'root',
  DB_PASSWORD: '',

  DB_TEST_HOST: 'localhost',
  DB_TEST_NAME: 'db_dev',
  DB_TEST_USER: 'root',
  DB_TEST_PASSWORD: '',

  DISABLE_CONSOLE: false,
  ACTIVE_TEST_CONSOLE: false,

  OVERALL_REQUESTS_LIMIT: 10,
  OVERALL_REQUESTS_DURATION: 0,
};
