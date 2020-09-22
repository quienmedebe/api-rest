const chai = require('chai');
const {createApplication} = require('../../src/app');
const defaultEnv = require('./defaultEnv');

const withEnvironment = async (env = {}) => {
  const stringifiedValues = {};
  Object.entries(env).forEach(([key, value]) => {
    stringifiedValues[key.toString()] = value.toString();
  });

  const environment = {
    ...process.env,
    APP_ENV: 'test',
    ...defaultEnv,
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
