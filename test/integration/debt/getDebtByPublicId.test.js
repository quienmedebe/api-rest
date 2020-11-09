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

describe.only('/debt/:id GET', function () {
  beforeEach(async function () {
    ACCESS_TOKEN_SECRET = Utils.Stubs.Config.ACCESS_TOKEN_SECRET(Utils.constants.ACCESS_TOKEN_SECRET);
    await prepare();
  });
  afterEach(function () {
    ACCESS_TOKEN_SECRET.restore();
    tearDown();
  });

  it('should return 401 if the user is not authenticated', async function () {
    const requester = getRequester();
    const id = 'xxxxxx-xxxxxx-xxxx-xxxx';

    const response = await requester.get(`/debt/${id}`);

    expect(response, 'Invalid status code').to.have.status(401);
    expect(response.body, 'error property not found').to.have.property('error');
    expect(response).to.matchApiSchema();
  });

  it('should return 400 if the debt does not exist', async function () {
    const requester = getRequester();
    const id = 'xxxxxx-xxxxxx-xxxx-xxxx';

    const account = await Utils.factories.AccountFactory();
    const access_token = await account.email_providers[0].getToken({id: account.id});

    const response = await requester.get(`/debt/${id}`).set('Authorization', `Bearer ${access_token}`);

    expect(response, 'Invalid status code').to.have.status(400);
    expect(response.body, 'error property not found').to.have.property('error');
    expect(response).to.matchApiSchema();
  });

  it('should return the details of the debt with the public id as the id', async function () {
    const requester = getRequester();

    const account = await Utils.factories.AccountFactory();
    const debt = await Utils.factories.DebtFactory({account_id: account.id});
    const access_token = await account.email_providers[0].getToken({id: account.id});

    const response = await requester.get(`/debt/${debt.public_id}`).set('Authorization', `Bearer ${access_token}`);

    expect(response, 'Invalid status code').to.have.status(200);
    expect(response.body, 'result property not found').to.have.property('result');
    expect(response.body.result).to.have.property('id', debt.id);
    expect(+response.body.result).to.have.property('amount', +debt.amount);
    expect(response.body.result).to.have.property('type', debt.type);
    expect(response.body.result).to.have.property('status', debt.status);
    expect(response).to.matchApiSchema();
  });

  it('should return 400 if the debt is owned by another account', async function () {
    const requester = getRequester();

    const accountA = await Utils.factories.AccountFactory();
    const accountB = await Utils.factories.AccountFactory();
    const debt = await Utils.factories.DebtFactory({account_id: accountB.id});
    const access_token = await accountA.email_providers[0].getToken({id: accountA.id});

    const response = await requester.get(`/debt/${debt.public_id}`).set('Authorization', `Bearer ${access_token}`);

    expect(response, 'Invalid status code').to.have.status(400);
    expect(response.body, 'error property not found').to.have.property('error');
    expect(response).to.matchApiSchema();
  });
});
