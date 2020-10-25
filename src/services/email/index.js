const templates = require('./templates');
const strategies = require('./strategies');
const validation = require('./validation');

function Email(strategy = strategies.DefaultStrategy()) {
  this._strategy = strategy;

  return this._strategy;
}

Email.useStrategy = strategy => {
  this._strategy = strategy;
};

Email.getClient = () => {
  return this._strategy;
};

Email.templates = templates;
Email.strategies = strategies;
Email.validation = validation;

module.exports = Email;
