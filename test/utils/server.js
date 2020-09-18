const chai = require('chai');
const chaiHttp = require('chai-http');
const Env = require('../../src/env');
const {createApplication} = require('../../src/app');

chai.use(chaiHttp);

let requester, app;

function setup() {
  app = createApplication({
    env: {
      ...Env,
      APP_ENV: 'test',
    },
  });
  requester = chai.request.agent(app);
}

function cleanUp() {
  app.close(() => {
    requester.close();
  });
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
