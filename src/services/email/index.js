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

Email.getStrategyByName = (strategyName, emailConfig, {logger, makeApiCall} = {}) => {
  switch (strategyName) {
    case 'mailjet':
      return strategies.MailJetStrategy(emailConfig.MAILJET_CLIENT_ID, emailConfig.MAILJET_SECRET, {logger, makeApiCall});
    default:
      return strategies.DefaultStrategy();
  }
};

Email.templates = templates;
Email.strategies = strategies;
Email.validation = validation;

module.exports = Email;
