const Sequelize = require('sequelize');

const env = process.env.APP_ENV || 'development';
const config = require('./config.json')[env.toString()];

module.exports = function getSequelize({dbName, user, password, host}) {
  let sequelize;
  if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], {...config, host});
  } else {
    sequelize = new Sequelize(dbName || config.database, user || config.username, password || config.password, {...config, host});
  }

  return sequelize;
};
