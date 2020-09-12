const chai = require('chai');

async function withEnvironment(Env, env = {}, callback) {
  const originalEnv = {};
  Object.entries(env).forEach(([key, value]) => {
    originalEnv[key.toString()] = Env[key.toString()];
    Env[key.toString()] = value;
  });

  delete require.cache[require.resolve('../../src/app')];
  const app = require('../../src/app');
  const requester = chai.request.agent(app);

  await callback(requester);

  Object.keys(env).forEach(key => {
    Env[key.toString()] = originalEnv[key.toString()];
  });
}

module.exports = withEnvironment;
