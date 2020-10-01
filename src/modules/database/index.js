const Sequelize = require('sequelize');

let sequelize, models, functions;
function init({dbName, user, password, host}) {
  const dbConfig = {
    dbName,
    user,
    password,
    host,
  };

  functions = require('./functions');
  sequelize = require('./sequelize')(dbConfig);
  models = require('./models')(sequelize, Sequelize.DataTypes);
}

exports.init = init;
exports.sequelize = sequelize;
exports.models = models;
exports.functions = functions;
module.exports = exports;
