const Env = require('../../src/env');
const {createApplication} = require('../../src/app');

const chai = require('chai');

const withEnvironment = (env = {}) => {
  const environment = {
    ...Env,
    APP_ENV: 'test',
    ...env,
  };
  const app = createApplication({
    env: environment,
  });

  return async callback => {
    const requester = chai.request.agent(app);

    await callback(requester);

    requester.close();
  };
};

module.exports = withEnvironment;
