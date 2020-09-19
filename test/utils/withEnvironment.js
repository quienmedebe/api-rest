const chai = require('chai');
const {createApplication} = require('../../src/app');

const withEnvironment = async (env = {}) => {
  const environment = {
    ...process.env,
    APP_ENV: 'test',
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
      app.close(() => {
        requester.close();
      });
    }
  };
};

module.exports = withEnvironment;
