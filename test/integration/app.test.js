const chai = require('chai');
const expect = chai.expect;
const Utils = require('../utils');
const Env = require('../../src/env');

describe('app.js test suite', function () {
  beforeEach('Setup: Create server clean db', Utils.Server.setup);
  afterEach('Tear down: Close server, clean db', Utils.Server.cleanUp);

  it('should fire the rate limiter when the requests per seconds are above the limit', async function () {
    const rateLimit = 1;
    const newEnvironment = {
      OVERALL_REQUESTS_LIMIT: rateLimit,
    };

    return await Utils.withEnvironment(Env, newEnvironment, async requester => {
      const requests = new Array(rateLimit + 1).fill(0).map(async () => {
        return await requester.get('/invalid-route');
      });

      const responses = await Promise.all(requests);
      expect(responses[responses.length - 1]).to.have.status(429);
      expect(responses[responses.length - 2]).to.not.have.status(429);
    });
  });

  it('should disable the reate limiter when the request limit is 0', async function () {
    const rateLimit = 0;
    const newEnvironment = {
      OVERALL_REQUESTS_LIMIT: rateLimit,
    };

    return await Utils.withEnvironment(Env, newEnvironment, async requester => {
      const requests = new Array(rateLimit + 2).fill(0).map(async () => {
        return await requester.get('/invalid-route');
      });

      const responses = await Promise.all(requests);
      expect(responses[responses.length - 1]).to.not.have.status(429);
      expect(responses[responses.length - 2]).to.not.have.status(429);
    });
  });
});
