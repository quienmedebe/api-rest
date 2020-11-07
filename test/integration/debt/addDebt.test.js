const chai = require('chai');
const chaiHttp = require('chai-http');
const matchApiSchema = require('api-contract-validator').chaiPlugin;
const path = require('path');
const apiSpec = path.join(__dirname, '../../../swagger.json');
const Utils = require('../../utils');

const {prepare, tearDown, getRequester} = Utils.integration;

const expect = chai.expect;
chai.use(chaiHttp);
chai.use(matchApiSchema({apiDefinitionsPath: apiSpec}));

let ACCESS_TOKEN_SECRET;

describe.only('/debt POST', function () {
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

    const body = {
      amount: 32.55,
      type: 'DEBT',
    };

    const response = await requester.post('/debt').send(body);

    expect(response, 'Invalid status code').to.have.status(401);
    expect(response.body, 'error property not found').to.have.property('error');
    expect(response).to.matchApiSchema();
  });

  it('should return a 400 error if the amount is not a number', async function () {
    const requester = getRequester();

    const user = await Utils.factories.AccountFactory();

    const access_token = await user.email_providers[0].getToken({id: user.id});

    const body = {
      amount: 'Not a number',
      type: 'DEBT',
    };

    const response = await requester.post('/debt').set('Authorization', `Bearer ${access_token}`).send(body);

    expect(response, 'Invalid status code').to.have.status(400);
    expect(response.body, 'error property not found').to.have.property('error');
    expect(response).to.matchApiSchema();
  });

  it('should return a 400 error if the type of the debt is not correct', async function () {
    const requester = getRequester();

    const user = await Utils.factories.AccountFactory();

    const access_token = await user.email_providers[0].getToken({id: user.id});

    const body = {
      amount: 15.65,
      type: 'Not a valid type',
    };

    const response = await requester.post('/debt').set('Authorization', `Bearer ${access_token}`).send(body);

    expect(response, 'Invalid status code').to.have.status(400);
    expect(response.body, 'error property not found').to.have.property('error');
    expect(response).to.matchApiSchema();
  });

  it('should create a debt if all parameters are correct', async function () {
    const requester = getRequester();

    const user = await Utils.factories.AccountFactory();

    const access_token = await user.email_providers[0].getToken({id: user.id});

    const body = {
      amount: 15.65,
      type: 'DEBT',
    };

    const response = await requester.post('/debt').set('Authorization', `Bearer ${access_token}`).send(body);

    const [debt] = await Utils.factories.DebtFactory.findAllByAccountId(user.id);

    expect(response, 'Invalid status code').to.have.status(200);
    expect(response.body, 'result property not found').to.have.property('result');
    expect(response.body.result.id, 'Public property should be returned as the id').to.have.lengthOf(36);
    expect(response.body.result, 'The amounts do not match').to.have.property('amount', debt.amount);
    expect(response).to.matchApiSchema();
  });

  it('should create a debt of type credit if all parameters are correct', async function () {
    const requester = getRequester();

    const user = await Utils.factories.AccountFactory();

    const access_token = await user.email_providers[0].getToken({id: user.id});

    const body = {
      amount: 3.25,
      type: 'CREDIT',
    };

    const response = await requester.post('/debt').set('Authorization', `Bearer ${access_token}`).send(body);

    const [debt] = await Utils.factories.DebtFactory.findAllByAccountId(user.id);

    expect(response, 'Invalid status code').to.have.status(200);
    expect(response.body, 'result property not found').to.have.property('result');
    expect(response.body.result.id, 'Public property should be returned as the id').to.have.lengthOf(36);
    expect(response.body.result, 'The amounts do not match').to.have.property('amount', debt.amount);
    expect(response).to.matchApiSchema();
  });
});
