const templates = require('./templates');
const strategies = require('./strategies');

function Email(strategy = strategies.DefaultStrategy()) {
  this._strategy = strategy;

  return this._strategy;
}

Email.prototype.use = strategy => {
  this._strategy = strategy;
};

Email.templates = templates;
Email.strategies = strategies;

module.exports = Email;
