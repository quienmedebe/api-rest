require('dotenv').config();

module.exports = {
  development: {
    use_env_variable: 'DB_URL',
    dialect: 'postgres',
  },
  test: {
    use_env_variable: 'DB_URL_TEST',
    dialect: 'postgres',
    logging: false,
  },
  production: {
    use_env_variable: 'DB_URL',
    dialect: 'postgres',
  },
};
