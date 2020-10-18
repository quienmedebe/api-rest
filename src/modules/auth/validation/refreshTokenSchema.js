const Shared = require('../../shared');

module.exports = {
  type: 'string',
  minLength: Shared.defs.AUTH.refreshToken.minLength,
  maxLength: Shared.defs.AUTH.refreshToken.maxLength,
};
