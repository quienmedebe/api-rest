const bcrypt = require('bcryptjs');
const Ajv = require('ajv');
const Database = require('../../../database');
const validation = require('../validation');
const ERRORS = require('../errors');

const createAccountFromEmailAndPassword = async (email, password, accountAttributes = {}, options = {}) => {
  const salt = options.salt || 16;

  const ajv = new Ajv();
  const isEmailValid = ajv.validate(validation.emailSchema, email);
  const isPasswordValid = ajv.validate(validation.passwordSchema, password);

  if (!isEmailValid || !isPasswordValid) {
    throw new Error('Some arguments are invalid');
  }

  const hashedPassword = await bcrypt.hash(password, salt);

  const response = await Database.functions.auth.createAccountFromEmailAndPassword(email, hashedPassword, accountAttributes);

  if (!response) {
    return ERRORS.DUPLICATE_EMAIL;
  }

  return response;
};

module.exports = function () {
  return module.exports.createAccountFromEmailAndPassword.apply(this, arguments);
};
module.exports.createAccountFromEmailAndPassword = createAccountFromEmailAndPassword;
