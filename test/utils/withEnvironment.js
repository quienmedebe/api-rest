const chai = require('chai');
const {createApplication} = require('../../src/app');
const Env = require('../../src/env');

const withEnvironment = async (env = {}) => {
  const stringifiedValues = {};
  Object.entries(env).forEach(([key, value]) => {
    stringifiedValues[key.toString()] = value.toString();
  });

  const environment = {
    ...process.env,
    ...Env,
    APP_ENV: 'test',
    ...stringifiedValues,
  };

  const app = createApplication({
    env: environment,
  });

  return async callback => {
    const requester = chai.request.agent(app);
    try {
      await callback(requester);
    } finally {
      app.close(() => {
        requester.close();
      }, true);
    }
  };
};

module.exports = withEnvironment;
