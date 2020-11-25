exports.INVALID_PASSWORD = {error: 'INVALID_PASSWORD', message: 'The password is invalid', status: 400};
exports.INVALID_EMAIL_TOKEN = {error: 'INVALID_EMAIL_TOKEN', message: 'The token is not valid', status: 400};

exports.INVALID_EMAIL = {error: 'INVALID_EMAIL', message: 'The email is invalid', status: 400};
exports.DUPLICATE_EMAIL = {error: 'DUPLICATE_EMAIL', message: 'The email already exists', status: 400};
exports.EMAIL_NOT_FOUND = {error: 'EMAIL_NOT_FOUND', message: 'The email does not exist', status: 400};

exports.ACCOUNT_NOT_FOUND = {error: 'ACCOUNT_NOT_FOUND', message: 'Account not found', status: 400};

exports.REFRESH_TOKEN_NOT_FOUND = {error: 'REFRESH_TOKEN_NOT_FOUND', message: 'No valid refresh token has been found', status: 400};

exports.APPLE_SIGN_IN = {
  AuthorizationError: {error: 'AuthorizationError', message: 'App was not allowed to sign in. Try again', status: 400},
  TokenError: {error: 'TokenError', message: "Error getting a token from Apple's servers", status: 400},
};

module.exports = exports;
