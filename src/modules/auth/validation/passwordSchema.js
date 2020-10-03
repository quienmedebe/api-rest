const Shared = require('../../shared');

module.exports = {
  type: 'string',
  minLength: Shared.defs.AUTH.password.minLength,
  maxLength: Shared.defs.AUTH.password.maxLength,
};
