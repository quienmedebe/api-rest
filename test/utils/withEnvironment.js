const chai = require('chai');
const {createApplication} = require('../../src/app');
const defaultEnv = require('../../src/env.default');
const truncateDB = require('./truncateDB');

const withEnvironment = async (env = {}) => {
  const environment = {
    ...process.env,
    ...defaultEnv,
    NODE_ENV: 'test',
    APP_ENV: 'test',
    ACTIVE_TEST_CONSOLE: false,
    SALT_NUMBER: 1,
    OVERALL_REQUESTS_LIMIT: 0,
    ...env,
  };

  const app = createApplication({
    env: environment,
  });

  return async callback => {
    const requester = chai.request.agent(app);
    try {
      await callback(requester);
    } finally {
      await truncateDB();
      app.close(() => {
        requester.close();
      }, true);
    }
  };
};

module.exports = withEnvironment;
