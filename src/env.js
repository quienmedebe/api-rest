const path = require('path');

const environmentVariables = require('dotenv-extended').load({
  path: path.join(__dirname, '../.env'),
  defaults: path.join(__dirname, '../.env.defaults'),
  schema: path.join(__dirname, '../.env.schema'),
  errorOnMissing: true,
});

module.exports = environmentVariables;
