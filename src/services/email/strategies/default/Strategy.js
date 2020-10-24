const _notImplemented = require('./internals/_notImplemented');

function DefaultStrategy() {
  return {
    sendEmail: _notImplemented('sendEmail', true),
  };
}

module.exports = DefaultStrategy;
