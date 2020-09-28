'use strict';

const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);

const getModels = (sequelize, DataTypes) => {
  const db = {};

  // eslint-disable-next-line --- https://github.com/nodesecurity/eslint-plugin-security/issues/65 - https://github.com/nodesecurity/eslint-plugin-security#detect-non-literal-fs-filename
  fs.readdirSync(__dirname)
    .filter(file => {
      return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
    })
    .forEach(file => {
      // eslint-disable-next-line --- https://github.com/nodesecurity/eslint-plugin-security#detect-non-literal-require
      const model = require(path.join(__dirname, file))(sequelize, DataTypes);
      db[model.name] = model;
    });

  Object.keys(db).forEach(modelName => {
    if (db[modelName.toString()].associate) {
      db[modelName.toString()].associate(db);
    }
  });

  return db;
};

module.exports = getModels;
