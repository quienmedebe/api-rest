const Sequelize = require('sequelize');

module.exports = function Database({dbName, user, password}) {
  const dbConfig = {
    dbName,
    user,
    password,
  };
  const sequelize = require('./sequelize')(dbConfig);
  const models = require('./models')(sequelize, Sequelize.DataTypes);

  return {
    Sequelize,
    sequelize,
    models,
  };
};
