const STATUS = require('../status');

module.exports = {
  type: 'string',
  enum: [STATUS.PENDING, STATUS.PAID, STATUS.UNPAID],
};
