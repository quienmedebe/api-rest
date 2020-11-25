const path = require('path');

exports.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
exports.GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
exports.GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/auth/google/callback';

exports.APPLE_CLIENT_ID = process.env.APPLE_CLIENT_ID;
exports.APPLE_TEAM_ID = process.env.APPLE_TEAM_ID;
exports.APPLE_KEY_ID = process.env.APPLE_KEY_ID;
exports.APPLE_PRIVATE_KEY_LOCATION = `${path.join(__dirname, '../certificates')}/${process.env.APPLE_PRIVATE_KEY_NAME}.p8`;
exports.APPLE_CALLBACK_URL = process.env.APPLE_CALLBACK_URL || 'http://localhost:5000/auth/apple/callback';

module.exports = exports;
