const Shared = require('../../shared');

module.exports = {
  email: {
    type: 'string',
    format: 'email',
    minLength: Shared.defs.AUTH.email.minLength,
    maxLength: Shared.defs.AUTH.email.maxLength,
  },
};
