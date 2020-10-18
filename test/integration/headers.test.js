const chai = require('chai');
const chaiHttp = require('chai-http');
const matchApiSchema = require('api-contract-validator').chaiPlugin;
const path = require('path');
const apiSpec = path.join(__dirname, '../../swagger.json');
const Utils = require('../utils');

const setup = Utils.integration.setup;
const tearDown = Utils.integration.tearDown;
const getRequester = Utils.integration.getRequester;

const expect = chai.expect;
chai.use(chaiHttp);
chai.use(matchApiSchema({apiDefinitionsPath: apiSpec}));

describe('Headers test suite', function () {
  beforeEach(setup);
  afterEach(tearDown);

  it('should return the Access-Control-Allow-Origin header @integration @headers', async function () {
    const requester = getRequester();
    const request = await requester.get(Utils.INVALID_ROUTE);

    expect(request.headers['Access-Control-Allow-Origin'.toLowerCase()]).to.not.be.undefined;
  });

  it('should return the Content-Security-Policy header @integration @headers', async function () {
    const requester = getRequester();
    const request = await requester.get(Utils.INVALID_ROUTE);

    expect(request.headers['Content-Security-Policy'.toLowerCase()]).to.not.be.undefined;
  });

  it('should return the Expect-CT header @integration @headers', async function () {
    const requester = getRequester();
    const request = await requester.get(Utils.INVALID_ROUTE);

    expect(request.headers['Expect-CT'.toLowerCase()]).to.not.be.undefined;
  });

  it('should return the Referrer-Policy header @integration @headers', async function () {
    const requester = getRequester();
    const request = await requester.get(Utils.INVALID_ROUTE);

    expect(request.headers['Referrer-Policy'.toLowerCase()]).to.not.be.undefined;
  });

  it('should return the Strict-Transport-Security header @integration @headers', async function () {
    const requester = getRequester();
    const request = await requester.get(Utils.INVALID_ROUTE);

    expect(request.headers['Strict-Transport-Security'.toLowerCase()]).to.not.be.undefined;
  });

  it('should return the X-Content-Type-Options header @integration @headers', async function () {
    const requester = getRequester();
    const request = await requester.get(Utils.INVALID_ROUTE);

    expect(request.headers['X-Content-Type-Options'.toLowerCase()]).to.not.be.undefined;
  });

  it('should return the X-DNS-Prefetch-Control header @integration @headers', async function () {
    const requester = getRequester();
    const request = await requester.get(Utils.INVALID_ROUTE);

    expect(request.headers['X-DNS-Prefetch-Control'.toLowerCase()]).to.not.be.undefined;
  });

  it('should return the X-Download-Options header @integration @headers', async function () {
    const requester = getRequester();
    const request = await requester.get(Utils.INVALID_ROUTE);

    expect(request.headers['X-Download-Options'.toLowerCase()]).to.not.be.undefined;
  });

  it('should return the X-Frame-Options header @integration @headers', async function () {
    const requester = getRequester();
    const request = await requester.get(Utils.INVALID_ROUTE);

    expect(request.headers['X-Frame-Options'.toLowerCase()]).to.not.be.undefined;
  });

  it('should return the X-Permitted-Cross-Domain-Policies header @integration @headers', async function () {
    const requester = getRequester();
    const request = await requester.get(Utils.INVALID_ROUTE);

    expect(request.headers['X-Permitted-Cross-Domain-Policies'.toLowerCase()]).to.not.be.undefined;
  });

  it('should not return the X-Powered-By header @integration @headers', async function () {
    const requester = getRequester();
    const request = await requester.get(Utils.INVALID_ROUTE);

    expect(request.headers['X-Powered-By'.toLowerCase()]).to.be.undefined;
  });

  it('should return the X-XSS-Protection header @integration @headers', async function () {
    const requester = getRequester();
    const request = await requester.get(Utils.INVALID_ROUTE);

    expect(request.headers['X-XSS-Protection'.toLowerCase()]).to.not.be.undefined;
  });
});
