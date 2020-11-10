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

describe('/debt/:id PATCH', function () {
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

    const debtId = Utils.constants.PUBLIC_ID;

    const body = {
      amount: 15,
      type: 'DEBT',
    };

    const response = await requester.patch(`/debt/${debtId}`).send(body);

    expect(response, 'Invalid status code').to.have.status(401);
    expect(response.body, 'error property not found').to.have.property('error');
    expect(response).to.matchApiSchema();
  });

  it('should return a 400 error if the debt does not exist', async function () {
    const requester = getRequester();

    const user = await Utils.factories.AccountFactory();

    const access_token = await user.email_providers[0].getToken({id: user.id});

    const debtId = Utils.constants.PUBLIC_ID;

    const body = {
      amount: 15,
      type: 'DEBT',
    };

    const response = await requester.patch(`/debt/${debtId}`).set('Authorization', `Bearer ${access_token}`).send(body);

    expect(response, 'Invalid status code').to.have.status(400);
    expect(response.body, 'error property not found').to.have.property('error');
    expect(response).to.matchApiSchema();
  });

  it('should return a 400 error if the debt exists but is not owned by that account', async function () {
    const requester = getRequester();

    const userA = await Utils.factories.AccountFactory();
    const userB = await Utils.factories.AccountFactory();
    const debt = await Utils.factories.DebtFactory({account_id: userB.id});

    const access_token = await userA.email_providers[0].getToken({id: userA.id});

    const body = {
      amount: 15,
      type: 'DEBT',
    };

    const response = await requester.patch(`/debt/${debt.public_id}`).set('Authorization', `Bearer ${access_token}`).send(body);

    expect(response, 'Invalid status code').to.have.status(400);
    expect(response.body, 'error property not found').to.have.property('error');
    expect(response).to.matchApiSchema();
  });

  it('should return a 400 error if the new amount is not a number', async function () {
    const requester = getRequester();

    const user = await Utils.factories.AccountFactory();
    const debt = await Utils.factories.DebtFactory({account_id: user.id}, false);

    const access_token = await user.email_providers[0].getToken({id: user.id});

    const body = {
      amount: 'Not a number',
      type: 'DEBT',
    };

    const initialAmount = debt.amount;

    const response = await requester.patch(`/debt/${debt.public_id}`).set('Authorization', `Bearer ${access_token}`).send(body);

    await debt.reload();

    expect(response, 'Invalid status code').to.have.status(400);
    expect(response.body, 'error property not found').to.have.property('error');
    expect(debt.amount, 'The debt should not have been edited').to.equal(initialAmount);
    expect(response).to.matchApiSchema();
  });

  it('should return a 400 error if the new type is not allowed', async function () {
    const requester = getRequester();

    const user = await Utils.factories.AccountFactory();
    const debt = await Utils.factories.DebtFactory({account_id: user.id}, false);

    const access_token = await user.email_providers[0].getToken({id: user.id});

    const body = {
      amount: 15,
      type: 'Not a valid type',
    };

    const initialType = debt.type;

    const response = await requester.patch(`/debt/${debt.public_id}`).set('Authorization', `Bearer ${access_token}`).send(body);

    await debt.reload();

    expect(response, 'Invalid status code').to.have.status(400);
    expect(response.body, 'error property not found').to.have.property('error');
    expect(debt.type, 'The debt should not have been edited').to.equal(initialType);
    expect(response).to.matchApiSchema();
  });

  it('should edit the debt', async function () {
    const requester = getRequester();

    const user = await Utils.factories.AccountFactory();
    const debt = await Utils.factories.DebtFactory({account_id: user.id, amount: 3}, false);

    const access_token = await user.email_providers[0].getToken({id: user.id});

    const body = {
      amount: 15,
      type: 'DEBT',
    };

    const response = await requester.patch(`/debt/${debt.public_id}`).set('Authorization', `Bearer ${access_token}`).send(body);

    await debt.reload();

    expect(response, 'Invalid status code').to.have.status(200);
    expect(response.body, 'result property not found').to.have.property('result');
    expect(response.body.result, 'id of the edited debt must be its public id').to.have.property('id', debt.public_id);
    expect(response.body.result.id, 'id of the edited debt must be an uuid').to.have.lengthOf(36);
    expect(+debt.amount, 'The debt amount should be edited').to.equal(body.amount);
    expect(debt.type, 'The debt type should be edited').to.equal(body.type);
    expect(response).to.matchApiSchema();
  });

  it('should edit the debt if only a valid amount is passed', async function () {
    const requester = getRequester();

    const user = await Utils.factories.AccountFactory();
    const debt = await Utils.factories.DebtFactory({account_id: user.id, amount: 3}, false);

    const access_token = await user.email_providers[0].getToken({id: user.id});

    const body = {
      amount: 25,
    };

    const initialType = debt.type;

    const response = await requester.patch(`/debt/${debt.public_id}`).set('Authorization', `Bearer ${access_token}`).send(body);

    await debt.reload();

    expect(response, 'Invalid status code').to.have.status(200);
    expect(response.body, 'result property not found').to.have.property('result');
    expect(response.body.result, 'id of the edited debt must be its public id').to.have.property('id', debt.public_id);
    expect(response.body.result.id, 'id of the edited debt must be an uuid').to.have.lengthOf(36);
    expect(+debt.amount, 'The debt amount should be edited').to.equal(body.amount);
    expect(debt.type, 'The debt type should not be edited').to.equal(initialType);
    expect(response).to.matchApiSchema();
  });

  it('should edit the debt if only a valid type is passed', async function () {
    const requester = getRequester();

    const user = await Utils.factories.AccountFactory();
    const debt = await Utils.factories.DebtFactory({account_id: user.id, type: 'CREDIT', amount: 3}, false);

    const access_token = await user.email_providers[0].getToken({id: user.id});

    const body = {
      type: 'DEBT',
    };

    const initialAmount = debt.amount;

    const response = await requester.patch(`/debt/${debt.public_id}`).set('Authorization', `Bearer ${access_token}`).send(body);

    await debt.reload();

    expect(response, 'Invalid status code').to.have.status(200);
    expect(response.body, 'result property not found').to.have.property('result');
    expect(response.body.result, 'id of the edited debt must be its public id').to.have.property('id', debt.public_id);
    expect(response.body.result.id, 'id of the edited debt must be an uuid').to.have.lengthOf(36);
    expect(debt.amount, 'The debt amount should not be edited').to.equal(initialAmount);
    expect(debt.type, 'The debt type should be edited').to.equal(body.type);
    expect(response).to.matchApiSchema();
  });

  it('should return a 400 response if neither the amount nor the type are set', async function () {
    const requester = getRequester();

    const user = await Utils.factories.AccountFactory();
    const debt = await Utils.factories.DebtFactory({account_id: user.id});

    const access_token = await user.email_providers[0].getToken({id: user.id});

    const body = {};

    const response = await requester.patch(`/debt/${debt.public_id}`).set('Authorization', `Bearer ${access_token}`).send(body);

    expect(response, 'Invalid status code').to.have.status(400);
    expect(response.body, 'error property not found').to.have.property('error');
    expect(response).to.matchApiSchema();
  });

  it('should return a 400 response if the new status is not valid', async function () {
    const requester = getRequester();

    const user = await Utils.factories.AccountFactory();
    const debt = await Utils.factories.DebtFactory({account_id: user.id});

    const access_token = await user.email_providers[0].getToken({id: user.id});

    const body = {
      status: 'Not a valid one',
    };

    const response = await requester.patch(`/debt/${debt.public_id}`).set('Authorization', `Bearer ${access_token}`).send(body);

    expect(response, 'Invalid status code').to.have.status(400);
    expect(response.body, 'error property not found').to.have.property('error');
    expect(response).to.matchApiSchema();
  });

  it('should change the status of the debt', async function () {
    const requester = getRequester();

    const user = await Utils.factories.AccountFactory();
    const debt = await Utils.factories.DebtFactory({account_id: user.id, status: 'PENDING'}, false);

    const access_token = await user.email_providers[0].getToken({id: user.id});

    const body = {
      status: 'PAID',
    };

    const response = await requester.patch(`/debt/${debt.public_id}`).set('Authorization', `Bearer ${access_token}`).send(body);

    await debt.reload();

    expect(response, 'Invalid status code').to.have.status(200);
    expect(response.body, 'result property not found').to.have.property('result');
    expect(response.body.result, 'id of the edited debt must be its public id').to.have.property('id', debt.public_id);
    expect(response.body.result.id, 'id of the edited debt must be an uuid').to.have.lengthOf(36);
    expect(debt.status, 'The debt status should be edited').to.equal(body.status);
    expect(response).to.matchApiSchema();
  });
});
