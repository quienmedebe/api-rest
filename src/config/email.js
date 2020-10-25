/***
 * Email configuration
 */

exports.RECOVER_PASSWORD_FROM_EMAIL = 'contacto@quienmedebe.com';
exports.RECOVER_PASSWORD_FROM_NAME = 'Quien Me Debe';
exports.RECOVER_PASSWORD_SUBJECT = 'Recupera tu contraseña';
exports.RECOVER_PASSWORD_ID = 'RecoverPassword';

/***
 * Mailjet
 */
exports.MAILJET_CLIENT_ID = process.env.MAILJET_CLIENT_ID;
exports.MAILJET_SECRET = process.env.MAILJET_SECRET;

module.exports = exports;
