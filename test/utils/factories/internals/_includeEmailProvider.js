const {EmailProvider} = require('../../../../src/database/models');

function _includeEmailProvider(withEmail) {
  if (withEmail) {
    return [
      {
        model: EmailProvider,
        as: 'email_providers',
      },
    ];
  }

  return [];
}

module.exports = _includeEmailProvider;
