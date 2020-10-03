const Shared = require('../../shared');

module.exports = {
  type: 'string',
  format: 'email',
  minLength: Shared.defs.AUTH.email.minLength,
  maxLength: Shared.defs.AUTH.email.maxLength,
};
