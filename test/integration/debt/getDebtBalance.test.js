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

describe.only('/debt/balance GET', function () {
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

    const response = await requester.get(`/debt/balance`);

    expect(response, 'Invalid status code').to.have.status(401);
    expect(response.body, 'error property not found').to.have.property('error');
    expect(response).to.matchApiSchema();
  });

  it('should return 200 with an amount of 0 when there are no debts', async function () {
    const requester = getRequester();

    const account = await Utils.factories.AccountFactory();
    const access_token = await account.email_providers[0].getToken({id: account.id});

    const response = await requester.get(`/debt/balance`).set('Authorization', `Bearer ${access_token}`);

    expect(response, 'Invalid status code').to.have.status(200);
    expect(response.body, 'result property not found').to.have.property('result');
    expect(+response.body.result).to.equal(0);
    expect(response).to.matchApiSchema();
  });

  it('should return 200 with the correct amount when there is a debt', async function () {
    const requester = getRequester();

    const account = await Utils.factories.AccountFactory();
    await Utils.factories.DebtFactory({account_id: account.id, amount: 5, type: 'DEBT'});
    const access_token = await account.email_providers[0].getToken({id: account.id});

    const response = await requester.get(`/debt/balance`).set('Authorization', `Bearer ${access_token}`);

    expect(response, 'Invalid status code').to.have.status(200);
    expect(response.body, 'result property not found').to.have.property('result');
    expect(+response.body.result).to.equal(-5);
    expect(response).to.matchApiSchema();
  });

  it('should return 200 with the correct amount when there is a credit', async function () {
    const requester = getRequester();

    const account = await Utils.factories.AccountFactory();
    await Utils.factories.DebtFactory({account_id: account.id, amount: 5, type: 'CREDIT'});
    const access_token = await account.email_providers[0].getToken({id: account.id});

    const response = await requester.get(`/debt/balance`).set('Authorization', `Bearer ${access_token}`);

    expect(response, 'Invalid status code').to.have.status(200);
    expect(response.body, 'result property not found').to.have.property('result');
    expect(+response.body.result).to.equal(5);
    expect(response).to.matchApiSchema();
  });

  it('should return 200 with the correct amount when there is a credit and a debt', async function () {
    const requester = getRequester();

    const account = await Utils.factories.AccountFactory();
    await Utils.factories.DebtFactory({account_id: account.id, amount: 5, type: 'CREDIT'});
    await Utils.factories.DebtFactory({account_id: account.id, amount: 0.1, type: 'DEBT'});
    const access_token = await account.email_providers[0].getToken({id: account.id});

    const response = await requester.get(`/debt/balance`).set('Authorization', `Bearer ${access_token}`);

    expect(response, 'Invalid status code').to.have.status(200);
    expect(response.body, 'result property not found').to.have.property('result');
    expect(+response.body.result).to.equal(4.9);
    expect(response).to.matchApiSchema();
  });

  it('should not leak debts from another account balances', async function () {
    const requester = getRequester();

    const accountA = await Utils.factories.AccountFactory();
    const accountB = await Utils.factories.AccountFactory();
    await Utils.factories.DebtFactory({account_id: accountA.id, amount: 5, type: 'CREDIT'});
    await Utils.factories.DebtFactory({account_id: accountA.id, amount: -0.1, type: 'DEBT'});
    const access_token = await accountB.email_providers[0].getToken({id: accountB.id});

    const response = await requester.get(`/debt/balance`).set('Authorization', `Bearer ${access_token}`);

    expect(response, 'Invalid status code').to.have.status(200);
    expect(response.body, 'result property not found').to.have.property('result');
    expect(+response.body.result).to.equal(0);
    expect(response).to.matchApiSchema();
  });
});
