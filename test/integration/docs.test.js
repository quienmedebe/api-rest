const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chaiArrays = require('chai-arrays');
const Utils = require('../utils');

const {prepare, tearDown, getRequester} = Utils.integration;

const expect = chai.expect;
chai.use(chaiHttp);
chai.use(sinonChai);
chai.use(chaiArrays);

describe('/docs', function () {
  beforeEach(async function () {
    sinon.stub(Date, 'now').returns(1000);
    // eslint-disable-next-line mocha/no-nested-tests
  });

  afterEach(function () {
    sinon.restore();
  });

  it('should return 200 if the environment is development', async function () {
    Utils.Stubs.Config.NODE_ENV('development');
    await prepare();

    const requester = getRequester();

    const response = await requester.post('/docs');

    expect(response, 'Invalid status code').to.have.status(200);

    tearDown();
  });

  it('should return 404 if the environment is production', async function () {
    Utils.Stubs.Config.NODE_ENV('production');
    await prepare();

    const requester = getRequester();

    const response = await requester.post('/docs');

    expect(response, 'Invalid status code').to.have.status(404);
    expect(response.body).to.have.property('error');

    tearDown();
  });
});
