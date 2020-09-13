const chai = require('chai');
const expect = chai.expect;
const Utils = require('../utils');
const Env = require('../../src/env');

describe('app.js test suite', function () {
  beforeEach('Setup: Create server clean db', Utils.Server.setup);
  afterEach('Tear down: Close server, clean db', Utils.Server.cleanUp);

  describe('Rate limiting test suite', function () {
    it('should fire a rate limiter when the requests per second and per ip are above the limit', async function () {
      const rateLimit = 1;
      const newEnvironment = {
        OVERALL_REQUESTS_LIMIT: rateLimit,
      };

      return await Utils.withEnvironment(Env, newEnvironment, async requester => {
        const requests = new Array(rateLimit + 1).fill(0).map(async () => {
          return await requester.get(Utils.INVALID_ROUTE);
        });

        const responses = await Promise.all(requests);
        expect(responses[responses.length - 1]).to.have.status(429);
        expect(responses[responses.length - 2]).to.not.have.status(429);
      });
    });

    it('should not fire a rate limiter when the requests per second and per ip limit is 0', async function () {
      const rateLimit = 0;
      const newEnvironment = {
        OVERALL_REQUESTS_LIMIT: rateLimit,
      };

      return await Utils.withEnvironment(Env, newEnvironment, async requester => {
        const requests = new Array(rateLimit + 2).fill(0).map(async () => {
          return await requester.get(Utils.INVALID_ROUTE);
        });

        const responses = await Promise.all(requests);
        expect(responses[responses.length - 1]).to.not.have.status(429);
        expect(responses[responses.length - 2]).to.not.have.status(429);
      });
    });
  });

  describe('CORS test suite', function () {
    it('should return the Access-Control-Allow-Origin header', async function () {
      const requester = Utils.Server.getRequester();
      const request = await requester.get(Utils.INVALID_ROUTE);

      expect(request.headers['Access-Control-Allow-Origin'.toLowerCase()]).to.not.be.undefined;
    });
  });
});
