const chai = require('chai');
const chaiHttp = require('chai-http');
const matchApiSchema = require('api-contract-validator').chaiPlugin;
const path = require('path');
const apiSpec = path.join(__dirname, '../../../swagger.json');
const Utils = require('../../utils');

const {setup, tearDown, getRequester} = Utils.integration;

const expect = chai.expect;
chai.use(chaiHttp);
chai.use(matchApiSchema({apiDefinitionsPath: apiSpec}));

let REFRESH_TOKEN_SECRET;

describe.only('/auth/refresh', function () {
  beforeEach(async function () {
    REFRESH_TOKEN_SECRET = Utils.Stubs.Config.REFRESH_TOKEN_SECRET(Utils.constants.REFRESH_TOKEN_SECRET);
    // eslint-disable-next-line mocha/no-nested-tests
    await setup();
  });

  afterEach(function () {
    REFRESH_TOKEN_SECRET.restore();
    tearDown();
  });

  it('should return a new access token if the refresh token exists in the database, is not expired, is not invalidated and the account id is correct', async function () {
    const requester = getRequester();

    const account = await Utils.factories.AccountFactory();
    const refreshToken = await Utils.factories.RefreshTokenFactory({account_id: account.id}, false);

    const body = {
      accountId: account.id,
      refreshToken: refreshToken.id,
    };

    const response = await requester.post('/auth/refresh').send(body);

    await refreshToken.reload();

    expect(response, 'Invalid status code').to.have.status(200);
    expect(response.body, 'Access token not found').to.have.property('access_token');
    expect(refreshToken.issued_tokens, 'Number of issued tokens not updated').to.equal(1);

    expect(response, 'Wrong API documentation').to.matchApiSchema();
  });

  it('should return an error if the account id from the request is not the same as the account id from the refresh token', async function () {
    const requester = getRequester();

    const accountA = await Utils.factories.AccountFactory();
    const accountB = await Utils.factories.AccountFactory();
    const refreshToken = await Utils.factories.RefreshTokenFactory({account_id: accountA.id}, false);

    const body = {
      accountId: accountB.id,
      refreshToken: refreshToken.id,
    };

    const response = await requester.post('/auth/refresh').send(body);

    await refreshToken.reload();

    expect(response, 'Invalid status code').to.have.status(401);
    expect(response.body, 'Invalid error code').to.have.property('error');
    expect(refreshToken.issued_tokens, 'Number of issued tokens not updated').to.equal(0);

    expect(response, 'Wrong API documentation').to.matchApiSchema();
  });

  it('should return an error if the refresh token is invalidated', async function () {
    const requester = getRequester();

    const account = await Utils.factories.AccountFactory();
    const refreshToken = await Utils.factories.RefreshTokenFactory({account_id: account.id, valid: false}, false);

    const body = {
      accountId: account.id,
      refreshToken: refreshToken.id,
    };

    const response = await requester.post('/auth/refresh').send(body);

    await refreshToken.reload();

    expect(response, 'Invalid status code').to.have.status(401);
    expect(response.body, 'Invalid error code').to.have.property('error');
    expect(refreshToken.issued_tokens, 'Number of issued tokens not updated').to.equal(0);

    expect(response, 'Wrong API documentation').to.matchApiSchema();
  });

  it('should return an error if the refresh token has expired', async function () {
    const requester = getRequester();

    const account = await Utils.factories.AccountFactory();
    const refreshToken = await Utils.factories.RefreshTokenFactory({account_id: account.id, expiration_datetime: Date.now() - 1000 * 30}, false);

    const body = {
      accountId: account.id,
      refreshToken: refreshToken.id,
    };

    const response = await requester.post('/auth/refresh').send(body);

    await refreshToken.reload();

    expect(response, 'Invalid status code').to.have.status(401);
    expect(response.body, 'Invalid error code').to.have.property('error');
    expect(refreshToken.issued_tokens, 'Number of issued tokens not updated').to.equal(0);

    expect(response, 'Wrong API documentation').to.matchApiSchema();
  });

  it('should return an error if the refresh token does not exist', async function () {
    const requester = getRequester();

    const account = await Utils.factories.AccountFactory();

    const body = {
      accountId: account.id,
      refreshToken: 'random_refresh_token',
    };

    const response = await requester.post('/auth/refresh').send(body);

    expect(response, 'Invalid status code').to.have.status(401);
    expect(response.body, 'Invalid error code').to.have.property('error');

    expect(response, 'Wrong API documentation').to.matchApiSchema();
  });

  it('should return an error if the account id is not set', async function () {
    const requester = getRequester();

    const account = await Utils.factories.AccountFactory();
    const refreshToken = await Utils.factories.RefreshTokenFactory({account_id: account.id}, false);

    const body = {
      refreshToken: refreshToken.id,
    };

    await refreshToken.reload();

    const response = await requester.post('/auth/refresh').send(body);

    expect(response, 'Invalid status code').to.have.status(401);
    expect(response.body, 'Invalid error code').to.have.property('error');
    expect(refreshToken.issued_tokens, 'Number of issued tokens not updated').to.equal(0);

    expect(response, 'Wrong API documentation').to.matchApiSchema();
  });

  it('should return an error if the refresh token is not set', async function () {
    const requester = getRequester();

    const account = await Utils.factories.AccountFactory();
    const refreshToken = await Utils.factories.RefreshTokenFactory({account_id: account.id}, false);

    const body = {
      accountId: account.id,
    };

    await refreshToken.reload();

    const response = await requester.post('/auth/refresh').send(body);

    expect(response, 'Invalid status code').to.have.status(401);
    expect(response.body, 'Invalid error code').to.have.property('error');
    expect(refreshToken.issued_tokens, 'Number of issued tokens not updated').to.equal(0);

    expect(response, 'Wrong API documentation').to.matchApiSchema();
  });
});
