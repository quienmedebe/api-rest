const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiArrays = require('chai-arrays');
const matchApiSchema = require('api-contract-validator').chaiPlugin;
const path = require('path');
const apiSpec = path.join(__dirname, '../../../swagger.json');
const Utils = require('../../utils');

const {prepare, tearDown, getRequester} = Utils.integration;

const expect = chai.expect;
chai.use(chaiHttp);
chai.use(chaiArrays);
chai.use(matchApiSchema({apiDefinitionsPath: apiSpec}));

let ACCESS_TOKEN_SECRET;

describe('/debt/list/:page?/:page_size? GET', function () {
  beforeEach(async function () {
    ACCESS_TOKEN_SECRET = Utils.Stubs.Config.ACCESS_TOKEN_SECRET(Utils.constants.ACCESS_TOKEN_SECRET);
    await prepare();
  });
  afterEach(function () {
    ACCESS_TOKEN_SECRET.restore();
    tearDown();
  });

  it('should return a 401 error if the user is not authenticated', async function () {
    const requester = getRequester();
    const page = 1;
    const pageSize = 25;

    const response = await requester.get(`/debt/list/${page}/${pageSize}`);

    expect(response, 'Invalid status code').to.have.status(401);
    expect(response.body, 'error property not found').to.have.property('error');
    expect(response).to.matchApiSchema();
  });

  it('should return 200 with an empty array if there are no debts', async function () {
    const requester = getRequester();
    const page = 1;
    const pageSize = 25;

    const account = await Utils.factories.AccountFactory();
    const access_token = await account.email_providers[0].getToken({id: account.public_id});

    const response = await requester.get(`/debt/list/${page}/${pageSize}`).set('Authorization', `Bearer ${access_token}`);

    expect(response, 'Invalid status code').to.have.status(200);
    expect(response.body, 'result property not found').to.have.property('result');
    expect(response.body.result).to.be.ofSize(0);
    expect(response.body).to.have.property('count', 0);
    expect(response.body).to.have.property('page', page);
    expect(response.body).to.have.property('pageSize', pageSize);
    expect(response).to.matchApiSchema();
  });

  it('should return the first page with a default page size if the parameters are not numbers', async function () {
    const requester = getRequester();
    const page = 'anan';
    const pageSize = {};

    const account = await Utils.factories.AccountFactory();
    const access_token = await account.email_providers[0].getToken({id: account.public_id});

    const response = await requester.get(`/debt/list/${page}/${pageSize}`).set('Authorization', `Bearer ${access_token}`);

    expect(response, 'Invalid status code').to.have.status(200);
    expect(response.body, 'result property not found').to.have.property('result');
    expect(response.body.result).to.be.ofSize(0);
    expect(response.body).to.have.property('count', 0);
    expect(response.body).to.have.property('page', 1);
    expect(response.body.pageSize).to.be.a('number');
    expect(response).to.matchApiSchema();
  });

  it('should return the results with default page and page size if they are not set', async function () {
    const requester = getRequester();

    const account = await Utils.factories.AccountFactory();
    const access_token = await account.email_providers[0].getToken({id: account.public_id});

    const response = await requester.get(`/debt/list`).set('Authorization', `Bearer ${access_token}`);

    expect(response, 'Invalid status code').to.have.status(200);
    expect(response.body, 'result property not found').to.have.property('result');
    expect(response.body.result).to.be.ofSize(0);
    expect(response.body).to.have.property('count', 0);
    expect(response.body).to.have.property('page', 1);
    expect(response.body.pageSize).to.be.a('number');
  });

  it('should return the correct number of debts', async function () {
    const requester = getRequester();

    const page = 1;
    const pageSize = 25;

    const account = await Utils.factories.AccountFactory();
    await Utils.factories.DebtFactory({account_id: account.id});
    const access_token = await account.email_providers[0].getToken({id: account.public_id});

    const response = await requester.get(`/debt/list/${page}/${pageSize}`).set('Authorization', `Bearer ${access_token}`);

    expect(response, 'Invalid status code').to.have.status(200);
    expect(response.body, 'result property not found').to.have.property('result');
    expect(response.body.result).to.be.ofSize(1);
    expect(response.body).to.have.property('count', 1);
    expect(response.body).to.have.property('page', page);
    expect(response.body).to.have.property('pageSize', pageSize);
    expect(response).to.matchApiSchema();
  });

  it('should not return any debt if the page has no debts', async function () {
    const requester = getRequester();

    const page = 2;
    const pageSize = 25;

    const account = await Utils.factories.AccountFactory();
    await Utils.factories.DebtFactory({account_id: account.id});
    const access_token = await account.email_providers[0].getToken({id: account.public_id});

    const response = await requester.get(`/debt/list/${page}/${pageSize}`).set('Authorization', `Bearer ${access_token}`);

    expect(response, 'Invalid status code').to.have.status(200);
    expect(response.body, 'result property not found').to.have.property('result');
    expect(response.body.result).to.be.ofSize(0);
    expect(response.body).to.have.property('count', 1);
    expect(response.body).to.have.property('page', page);
    expect(response.body).to.have.property('pageSize', pageSize);
    expect(response).to.matchApiSchema();
  });

  it('should return a number of debts lower than the page size', async function () {
    const requester = getRequester();

    const page = 1;
    const pageSize = 1;

    const account = await Utils.factories.AccountFactory();
    await Utils.factories.DebtFactory({account_id: account.id});
    await Utils.factories.DebtFactory({account_id: account.id});
    const access_token = await account.email_providers[0].getToken({id: account.public_id});

    const response = await requester.get(`/debt/list/${page}/${pageSize}`).set('Authorization', `Bearer ${access_token}`);

    expect(response, 'Invalid status code').to.have.status(200);
    expect(response.body, 'result property not found').to.have.property('result');
    expect(response.body.result).to.be.ofSize(1);
    expect(response.body).to.have.property('count', 2);
    expect(response.body).to.have.property('page', page);
    expect(response.body).to.have.property('pageSize', pageSize);
    expect(response).to.matchApiSchema();
  });

  it('should not leak other accounts debts', async function () {
    const requester = getRequester();

    const page = 1;
    const pageSize = 25;

    const accountA = await Utils.factories.AccountFactory();
    const accountB = await Utils.factories.AccountFactory();
    await Utils.factories.DebtFactory({account_id: accountA.id});
    await Utils.factories.DebtFactory({account_id: accountB.id});
    await Utils.factories.DebtFactory({account_id: accountB.id});
    const access_token = await accountB.email_providers[0].getToken({id: accountB.public_id});

    const response = await requester.get(`/debt/list/${page}/${pageSize}`).set('Authorization', `Bearer ${access_token}`);

    expect(response, 'Invalid status code').to.have.status(200);
    expect(response.body, 'result property not found').to.have.property('result');
    expect(response.body.result).to.be.ofSize(2);
    expect(response.body).to.have.property('count', 2);
    expect(response.body).to.have.property('page', page);
    expect(response.body).to.have.property('pageSize', pageSize);
    expect(response).to.matchApiSchema();
  });

  it('should not leak the private id on any debt', async function () {
    const requester = getRequester();

    const page = 1;
    const pageSize = 25;

    const account = await Utils.factories.AccountFactory();
    await Utils.factories.DebtFactory({account_id: account.id});
    const access_token = await account.email_providers[0].getToken({id: account.public_id});

    const response = await requester.get(`/debt/list/${page}/${pageSize}`).set('Authorization', `Bearer ${access_token}`);

    expect(response, 'Invalid status code').to.have.status(200);
    expect(response.body, 'result property not found').to.have.property('result');
    expect(response.body.result).to.be.ofSize(1);
    expect(response.body).to.have.property('count', 1);
    expect(response.body).to.have.property('page', page);
    expect(response.body).to.have.property('pageSize', pageSize);
    expect(response.body.result[0].id).to.have.lengthOf(36);
    expect(response.body.result[0].id).to.be.a('string');
    expect(response).to.matchApiSchema();
  });

  it('should never return the private account id', async function () {
    const requester = getRequester();

    const page = 1;
    const pageSize = 25;

    const account = await Utils.factories.AccountFactory();
    await Utils.factories.DebtFactory({account_id: account.id});
    await Utils.factories.DebtFactory({account_id: account.id});
    const access_token = await account.email_providers[0].getToken({id: account.public_id});

    const response = await requester.get(`/debt/list/${page}/${pageSize}`).set('Authorization', `Bearer ${access_token}`);

    expect(response.body.result.some(({account_id}) => account_id)).to.be.false;
  });
});
