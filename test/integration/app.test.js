const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;
chai.use(chaiHttp);

const Utils = require('../utils');

describe('app.js test suite', function () {
  describe('Rate limiting test suite', function () {
    it('should fire a rate limiter when the requests per second and per ip are above the limit', async function () {
      const REQUEST_LIMIT = 1;
      const doTest = await Utils.withEnvironment({
        OVERALL_REQUESTS_LIMIT: REQUEST_LIMIT.toString(),
      });

      return doTest(async requester => {
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
      const doTest = await Utils.withEnvironment({
        OVERALL_REQUESTS_LIMIT: REQUEST_LIMIT.toString(),
      });

      return doTest(async requester => {
        const requests = new Array(REQUESTS).fill(0).map(async () => {
          return await requester.get(Utils.INVALID_ROUTE);
        });

        const responses = await Promise.all(requests);
        expect(responses[responses.length - 1]).to.not.have.status(429);
        expect(responses[responses.length - 2]).to.not.have.status(429);
      });
    });

    it('should not add the RateLimit-Limit header to the response when the requests per second and per ip limit are 0', async function () {
      const REQUEST_LIMIT = 0;
      const doTest = await Utils.withEnvironment({
        OVERALL_REQUESTS_LIMIT: REQUEST_LIMIT.toString(),
      });

      return doTest(async requester => {
        const response = await requester.get(Utils.INVALID_ROUTE);

        expect(response.headers['RateLimit-Limit'.toLowerCase()]).to.be.undefined;
      });
    });

    it('should not add the RateLimit-Remaining header to the response when the requests per second and per ip limit are 0', async function () {
      const REQUEST_LIMIT = 0;
      const doTest = await Utils.withEnvironment({
        OVERALL_REQUESTS_LIMIT: REQUEST_LIMIT.toString(),
      });

      return doTest(async requester => {
        const response = await requester.get(Utils.INVALID_ROUTE);

        expect(response.headers['RateLimit-Remaining'.toLowerCase()]).to.be.undefined;
      });
    });

    it('should not add the RateLimit-Reset header to the response when the requests per second and per ip limit are 0', async function () {
      const REQUEST_LIMIT = 0;
      const doTest = await Utils.withEnvironment({
        OVERALL_REQUESTS_LIMIT: REQUEST_LIMIT.toString(),
      });

      return doTest(async requester => {
        const response = await requester.get(Utils.INVALID_ROUTE);

        expect(response.headers['RateLimit-Reset'.toLowerCase()]).to.be.undefined;
      });
    });

    it('should not have a limit if the rate limiter limit is below 0', async function () {
      const REQUEST_LIMIT = -1;
      const REQUESTS = 2;
      const doTest = await Utils.withEnvironment({
        OVERALL_REQUESTS_LIMIT: REQUEST_LIMIT.toString(),
      });

      return doTest(async requester => {
        const requests = new Array(REQUESTS).fill(0).map(async () => {
          return await requester.get(Utils.INVALID_ROUTE);
        });

        const responses = await Promise.all(requests);
        expect(responses[responses.length - 1]).to.not.have.status(429);
        expect(responses[responses.length - 2]).to.not.have.status(429);
      });
    });

    it('should include the next headers on a success response: RateLimit-Limit', async function () {
      const REQUEST_LIMIT = 10;
      const doTest = await Utils.withEnvironment({
        OVERALL_REQUESTS_LIMIT: REQUEST_LIMIT.toString(),
      });

      return doTest(async requester => {
        const response = await requester.get(Utils.INVALID_ROUTE);

        expect(response.headers['RateLimit-Limit'.toLowerCase()]).to.not.be.undefined;
      });
    });

    it('should include the next headers on a success response: RateLimit-Remaining', async function () {
      const REQUEST_LIMIT = 10;
      const doTest = await Utils.withEnvironment({
        OVERALL_REQUESTS_LIMIT: REQUEST_LIMIT.toString(),
      });

      return doTest(async requester => {
        const response = await requester.get(Utils.INVALID_ROUTE);

        expect(response.headers['RateLimit-Remaining'.toLowerCase()]).to.not.be.undefined;
      });
    });

    it('should include the next headers on a success response: RateLimit-Reset', async function () {
      const REQUEST_LIMIT = 10;
      const doTest = await Utils.withEnvironment({
        OVERALL_REQUESTS_LIMIT: REQUEST_LIMIT.toString(),
      });

      return doTest(async requester => {
        const response = await requester.get(Utils.INVALID_ROUTE);

        expect(response.headers['RateLimit-Reset'.toLowerCase()]).to.not.be.undefined;
      });
    });

    it('A Too Many Requests error should also include the next headers: Retry-After', async function () {
      const REQUEST_LIMIT = 1;
      const doTest = await Utils.withEnvironment({
        OVERALL_REQUESTS_LIMIT: REQUEST_LIMIT.toString(),
      });

      return doTest(async function (requester) {
        const requests = new Array(REQUEST_LIMIT + 2).fill(0).map(async () => {
          return await requester.get(Utils.INVALID_ROUTE);
        });

        const responses = await Promise.all(requests);
        const lastResponse = responses[responses.length - 1];

        expect(lastResponse.headers['Retry-After'.toLowerCase()]).to.not.be.undefined;
      });
    });
    it('A Too Many Requests error should also include the next headers: RateLimit-Limit', async function () {
      const REQUEST_LIMIT = 1;
      const doTest = await Utils.withEnvironment({
        OVERALL_REQUESTS_LIMIT: REQUEST_LIMIT.toString(),
      });

      return doTest(async function (requester) {
        const requests = new Array(REQUEST_LIMIT + 2).fill(0).map(async () => {
          return await requester.get(Utils.INVALID_ROUTE);
        });

        const responses = await Promise.all(requests);
        const lastResponse = responses[responses.length - 1];

        expect(lastResponse.headers['RateLimit-Limit'.toLowerCase()]).to.not.be.undefined;
      });
    });
    it('A Too Many Requests error should also include the next headers: RateLimit-Remaining', async function () {
      const REQUEST_LIMIT = 1;
      const doTest = await Utils.withEnvironment({
        OVERALL_REQUESTS_LIMIT: REQUEST_LIMIT.toString(),
      });

      return doTest(async function (requester) {
        const requests = new Array(REQUEST_LIMIT + 2).fill(0).map(async () => {
          return await requester.get(Utils.INVALID_ROUTE);
        });

        const responses = await Promise.all(requests);
        const lastResponse = responses[responses.length - 1];

        expect(lastResponse.headers['RateLimit-Remaining'.toLowerCase()]).to.not.be.undefined;
      });
    });
    it('A Too Many Requests error should also include the next headers: RateLimit-Reset', async function () {
      const REQUEST_LIMIT = 1;
      const doTest = await Utils.withEnvironment({
        OVERALL_REQUESTS_LIMIT: REQUEST_LIMIT.toString(),
      });

      return doTest(async function (requester) {
        const requests = new Array(REQUEST_LIMIT + 2).fill(0).map(async () => {
          return await requester.get(Utils.INVALID_ROUTE);
        });

        const responses = await Promise.all(requests);
        const lastResponse = responses[responses.length - 1];

        expect(lastResponse.headers['RateLimit-Reset'.toLowerCase()]).to.not.be.undefined;
      });
    });
  });

  describe('Headers test suite', function () {
    it('should return the Access-Control-Allow-Origin header', async function () {
      const doTest = await Utils.withEnvironment();

      return doTest(async requester => {
        const request = await requester.get(Utils.INVALID_ROUTE);

        expect(request.headers['Access-Control-Allow-Origin'.toLowerCase()]).to.not.be.undefined;
      });
    });

    it('should return the Content-Security-Policy header', async function () {
      const doTest = await Utils.withEnvironment();

      return doTest(async requester => {
        const request = await requester.get(Utils.INVALID_ROUTE);

        expect(request.headers['Content-Security-Policy'.toLowerCase()]).to.not.be.undefined;
      });
    });

    it('should return the Expect-CT header', async function () {
      const doTest = await Utils.withEnvironment();

      return doTest(async requester => {
        const request = await requester.get(Utils.INVALID_ROUTE);

        expect(request.headers['Expect-CT'.toLowerCase()]).to.not.be.undefined;
      });
    });

    it('should return the Referrer-Policy header', async function () {
      const doTest = await Utils.withEnvironment();

      return doTest(async requester => {
        const request = await requester.get(Utils.INVALID_ROUTE);

        expect(request.headers['Referrer-Policy'.toLowerCase()]).to.not.be.undefined;
      });
    });

    it('should return the Strict-Transport-Security header', async function () {
      const doTest = await Utils.withEnvironment();

      return doTest(async requester => {
        const request = await requester.get(Utils.INVALID_ROUTE);

        expect(request.headers['Strict-Transport-Security'.toLowerCase()]).to.not.be.undefined;
      });
    });

    it('should return the X-Content-Type-Options header', async function () {
      const doTest = await Utils.withEnvironment();

      return doTest(async requester => {
        const request = await requester.get(Utils.INVALID_ROUTE);

        expect(request.headers['X-Content-Type-Options'.toLowerCase()]).to.not.be.undefined;
      });
    });

    it('should return the X-DNS-Prefetch-Control header', async function () {
      const doTest = await Utils.withEnvironment();

      return doTest(async requester => {
        const request = await requester.get(Utils.INVALID_ROUTE);

        expect(request.headers['X-DNS-Prefetch-Control'.toLowerCase()]).to.not.be.undefined;
      });
    });

    it('should return the X-Download-Options header', async function () {
      const REQUEST_LIMIT = 10;
      const doTest = await Utils.withEnvironment({
        OVERALL_REQUESTS_LIMIT: REQUEST_LIMIT,
      });

      return doTest(async requester => {
        const request = await requester.get(Utils.INVALID_ROUTE);

        expect(request.headers['X-Download-Options'.toLowerCase()]).to.not.be.undefined;
      });
    });

    it('should return the X-Frame-Options header', async function () {
      const doTest = await Utils.withEnvironment();

      return doTest(async requester => {
        const request = await requester.get(Utils.INVALID_ROUTE);

        expect(request.headers['X-Frame-Options'.toLowerCase()]).to.not.be.undefined;
      });
    });

    it('should return the X-Permitted-Cross-Domain-Policies header', async function () {
      const doTest = await Utils.withEnvironment();

      return doTest(async requester => {
        const request = await requester.get(Utils.INVALID_ROUTE);

        expect(request.headers['X-Permitted-Cross-Domain-Policies'.toLowerCase()]).to.not.be.undefined;
      });
    });

    it('should not return the X-Powered-By header', async function () {
      const doTest = await Utils.withEnvironment();

      return doTest(async requester => {
        const request = await requester.get(Utils.INVALID_ROUTE);

        expect(request.headers['X-Powered-By'.toLowerCase()]).to.be.undefined;
      });
    });

    it('should return the X-XSS-Protection header', async function () {
      const doTest = await Utils.withEnvironment();

      return doTest(async requester => {
        const request = await requester.get(Utils.INVALID_ROUTE);

        expect(request.headers['X-XSS-Protection'.toLowerCase()]).to.not.be.undefined;
      });
    });
  });
});
