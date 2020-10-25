const templates = require('./templates');
const strategies = require('./strategies');
const validation = require('./validation');

function Email(strategy = strategies.DefaultStrategy()) {
  this._strategy = strategy;

  return this._strategy;
}

Email.use = strategy => {
  this._strategy = strategy;
};

Email.templates = templates;
Email.strategies = strategies;
Email.validation = validation;

module.exports = Email;
