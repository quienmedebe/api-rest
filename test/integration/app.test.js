const chaiHttp = require('chai-http');

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const app = require('../../src/app');
const Env = require('../../src/env');

chai.use(chaiHttp);
let requester;

function setup() {
  process.env.APP_ENV = 'test';
  requester = chai.request.agent(app);
}

function tearDown() {
  requester.close();
}

describe('app.js test suite', function () {
  beforeEach('Setup: Create server clean db', setup);
  afterEach('Tear down: Close server, clean db', tearDown);

  it('should fire the rate limiter when the requests per seconds are above the limit', async function () {
    const limit = '1';
    sinon.stub(Env, 'OVERALL_REQUESTS_LIMIT').returns(limit);

    const requests = new Array(+limit + 1).fill(0).map(async () => {
      return await requester.get('/invalid-route');
    });

    const responses = await Promise.all(requests);
    expect(responses[responses.length - 1]).to.have.status(429);
    expect(responses[responses.length - 2]).to.not.have.status(429);
  });
});
