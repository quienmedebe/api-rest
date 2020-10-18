exports.INVALID_EMAIL = {error: 'INVALID_EMAIL', message: 'The email is invalid', status: 400};
exports.INVALID_PASSWORD = {error: 'INVALID_PASSWORD', message: 'The password is invalid', status: 400};
exports.DUPLICATE_EMAIL = {error: 'DUPLICATE_EMAIL', message: 'The email already exists', status: 400};
exports.ACCOUNT_NOT_FOUND = {error: 'ACCOUNT_NOT_FOUND', message: 'Account not found', status: 400};
exports.REFRESH_TOKEN_NOT_FOUND = {error: 'REFRESH_TOKEN_NOT_FOUND', message: 'No valid refresh token has been found', status: 400};

module.exports = exports;
