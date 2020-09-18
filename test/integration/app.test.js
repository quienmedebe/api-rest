const chai = require('chai');
const expect = chai.expect;
const Utils = require('../utils');

describe('app.js test suite', function () {
  describe('Rate limiting test suite', function () {
    it('should fire a rate limiter when the requests per second and per ip are above the limit', async function () {
      const REQUEST_LIMIT = 1;

      return (
        await Utils.withEnvironment({
          OVERALL_REQUESTS_LIMIT: REQUEST_LIMIT,
        })
      )(async requester => {
        const requests = new Array(REQUEST_LIMIT + 1).fill(0).map(async () => {
          return await requester.get(Utils.INVALID_ROUTE);
        });

        const responses = await Promise.all(requests);
        expect(responses[responses.length - 1]).to.have.status(429);
        expect(responses[responses.length - 2]).to.not.have.status(429);
      });
    });

    it('should not fire a rate limiter when the requests per second and per ip limit are 0', async function () {
      const REQUEST_LIMIT = 0;
      const REQUESTS = 2;

      return (
        await Utils.withEnvironment({
          OVERALL_REQUESTS_LIMIT: REQUEST_LIMIT,
        })
      )(async requester => {
        const requests = new Array(REQUESTS).fill(0).map(async () => {
          return await requester.get(Utils.INVALID_ROUTE);
        });

        const responses = await Promise.all(requests);
        expect(responses[responses.length - 1]).to.not.have.status(429);
        expect(responses[responses.length - 2]).to.not.have.status(429);
      });
    });

    it('should not have a limit if the rate limiter limit is below 0', async function () {
      const REQUEST_LIMIT = -1;
      const REQUESTS = 2;

      return (
        await Utils.withEnvironment({
          OVERALL_REQUESTS_LIMIT: REQUEST_LIMIT,
        })
      )(async requester => {
        const requests = new Array(REQUESTS).fill(0).map(async () => {
          return await requester.get(Utils.INVALID_ROUTE);
        });

        const responses = await Promise.all(requests);
        expect(responses[responses.length - 1]).to.not.have.status(429);
        expect(responses[responses.length - 2]).to.not.have.status(429);
      });
    });

    it('should include the next headers on a success response: RateLimit-Limit, RateLimit-Remaining, RateLimit-Reset', async function () {
      Utils.Server.setup();

      const requester = Utils.Server.getRequester();

      const response = await requester.get(Utils.INVALID_ROUTE);

      expect(response.headers['RateLimit-Limit'.toLowerCase()]).to.not.be.undefined;
      expect(response.headers['RateLimit-Remaining'.toLowerCase()]).to.not.be.undefined;
      expect(response.headers['RateLimit-Reset'.toLowerCase()]).to.not.be.undefined;

      Utils.Server.cleanUp();
    });

    it('A Too Many Requests error should also include the next headers: Retry-After, RateLimit-Limit, RateLimit-Remaining, RateLimit-Reset', async function () {
      const REQUEST_LIMIT = 1;

      return (
        await Utils.withEnvironment({
          OVERALL_REQUESTS_LIMIT: REQUEST_LIMIT,
        })
      )(async function (requester) {
        const requests = new Array(REQUEST_LIMIT + 2).fill(0).map(async () => {
          return await requester.get(Utils.INVALID_ROUTE);
        });

        const responses = await Promise.all(requests);
        const lastResponse = responses[responses.length - 1];

        expect(lastResponse.headers['Retry-After'.toLowerCase()]).to.not.be.undefined;
        expect(lastResponse.headers['RateLimit-Limit'.toLowerCase()]).to.not.be.undefined;
        expect(lastResponse.headers['RateLimit-Remaining'.toLowerCase()]).to.not.be.undefined;
        expect(lastResponse.headers['RateLimit-Reset'.toLowerCase()]).to.not.be.undefined;
      });
    });
  });

  describe('Headers test suite', function () {
    it('should return the Access-Control-Allow-Origin header', async function () {
      Utils.Server.setup();

      const requester = Utils.Server.getRequester();
      const request = await requester.get(Utils.INVALID_ROUTE);

      expect(request.headers['Access-Control-Allow-Origin'.toLowerCase()]).to.not.be.undefined;
      Utils.Server.cleanUp();
    });

    it('should return the Content-Security-Policy header', async function () {
      Utils.Server.setup();

      const requester = Utils.Server.getRequester();
      const request = await requester.get(Utils.INVALID_ROUTE);

      expect(request.headers['Content-Security-Policy'.toLowerCase()]).to.not.be.undefined;
      Utils.Server.cleanUp();
    });

    it('should return the Expect-CT header', async function () {
      Utils.Server.setup();

      const requester = Utils.Server.getRequester();
      const request = await requester.get(Utils.INVALID_ROUTE);

      expect(request.headers['Expect-CT'.toLowerCase()]).to.not.be.undefined;
      Utils.Server.cleanUp();
    });

    it('should return the Referrer-Policy header', async function () {
      Utils.Server.setup();

      const requester = Utils.Server.getRequester();
      const request = await requester.get(Utils.INVALID_ROUTE);

      expect(request.headers['Referrer-Policy'.toLowerCase()]).to.not.be.undefined;
      Utils.Server.cleanUp();
    });

    it('should return the Strict-Transport-Security header', async function () {
      Utils.Server.setup();

      const requester = Utils.Server.getRequester();
      const request = await requester.get(Utils.INVALID_ROUTE);

      expect(request.headers['Strict-Transport-Security'.toLowerCase()]).to.not.be.undefined;
      Utils.Server.cleanUp();
    });

    it('should return the X-Content-Type-Options header', async function () {
      Utils.Server.setup();

      const requester = Utils.Server.getRequester();
      const request = await requester.get(Utils.INVALID_ROUTE);

      expect(request.headers['X-Content-Type-Options'.toLowerCase()]).to.not.be.undefined;
      Utils.Server.cleanUp();
    });

    it('should return the X-DNS-Prefetch-Control header', async function () {
      Utils.Server.setup();

      const requester = Utils.Server.getRequester();
      const request = await requester.get(Utils.INVALID_ROUTE);

      expect(request.headers['X-DNS-Prefetch-Control'.toLowerCase()]).to.not.be.undefined;
      Utils.Server.cleanUp();
    });

    it('should return the X-Download-Options header', async function () {
      Utils.Server.setup();

      const requester = Utils.Server.getRequester();
      const request = await requester.get(Utils.INVALID_ROUTE);

      expect(request.headers['X-Download-Options'.toLowerCase()]).to.not.be.undefined;
      Utils.Server.cleanUp();
    });

    it('should return the X-Frame-Options header', async function () {
      Utils.Server.setup();

      const requester = Utils.Server.getRequester();
      const request = await requester.get(Utils.INVALID_ROUTE);

      expect(request.headers['X-Frame-Options'.toLowerCase()]).to.not.be.undefined;
      Utils.Server.cleanUp();
    });

    it('should return the X-Permitted-Cross-Domain-Policies header', async function () {
      Utils.Server.setup();

      const requester = Utils.Server.getRequester();
      const request = await requester.get(Utils.INVALID_ROUTE);

      expect(request.headers['X-Permitted-Cross-Domain-Policies'.toLowerCase()]).to.not.be.undefined;
      Utils.Server.cleanUp();
    });

    it('should not return the X-Powered-By header', async function () {
      Utils.Server.setup();

      const requester = Utils.Server.getRequester();
      const request = await requester.get(Utils.INVALID_ROUTE);

      expect(request.headers['X-Powered-By'.toLowerCase()]).to.be.undefined;
      Utils.Server.cleanUp();
    });

    it('should return the X-XSS-Protection header', async function () {
      Utils.Server.setup();

      const requester = Utils.Server.getRequester();
      const request = await requester.get(Utils.INVALID_ROUTE);

      expect(request.headers['X-XSS-Protection'.toLowerCase()]).to.not.be.undefined;
      Utils.Server.cleanUp();
    });
  });
});
