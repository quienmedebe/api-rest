const Shared = require('../../shared');

module.exports = {
  type: 'string',
  minLength: Shared.defs.AUTH.emailToken.minLength,
  maxLength: Shared.defs.AUTH.emailToken.maxLength,
};
