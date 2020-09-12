const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

let requester, app;

function setup() {
  process.env.APP_ENV = 'test';
  app = require('../../src/app');
  requester = chai.request.agent(app);
}

function cleanUp() {
  requester.close();
  delete require.cache[require.resolve('../../src/app')];
}

function getApp() {
  return app;
}

function getRequester() {
  return requester;
}

exports.setup = setup;
exports.cleanUp = cleanUp;
exports.getApp = getApp;
exports.getRequester = getRequester;

module.exports = exports;
