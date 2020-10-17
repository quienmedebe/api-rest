const sinon = require('sinon');
const Config = require('../../../src/config');

exports.SALT_NUMBER = num => {
  const sandbox = sinon.createSandbox();
  return sandbox.stub(Config, 'SALT_NUMBER').value(num);
};
exports.JWT_SECRET = secret => {
  const sandbox = sinon.createSandbox();
  return sandbox.stub(Config, 'TOKEN_SECRET').value(secret);
};
exports.REFRESH_TOKEN_SECRET = secret => {
  const sandbox = sinon.createSandbox();
  return sandbox.stub(Config, 'REFRESH_TOKEN_SECRET').value(secret);
};

module.exports = exports;
