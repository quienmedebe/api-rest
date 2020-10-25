exports.AUTH = {
  email: {
    maxLength: 255,
    minLength: 5,
  },
  password: {
    maxLength: 255,
    minLength: 6,
  },
  refreshToken: {
    maxLength: 255,
    minLength: 255,
  },
  emailToken: {
    maxLength: 64,
    minLength: 64,
  },
};

exports.ACCOUNT = {
  id: {
    minimum: 1,
    maximum: 9223372036854775807,
  },
};

module.exports = exports;
