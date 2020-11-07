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

describe.only('/debt/:id DELETE', function () {
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

    const debtId = 'xxxxxx-xxxxxx-xxxx-xxxx';

    const response = await requester.delete(`/debt/${debtId}`);

    expect(response, 'Invalid status code').to.have.status(401);
    expect(response.body, 'error property not found').to.have.property('error');
    expect(response).to.matchApiSchema();
  });

  it('should return a 400 error if the debt does not exist', async function () {
    const requester = getRequester();

    const user = await Utils.factories.AccountFactory();

    const access_token = await user.email_providers[0].getToken({id: user.id});

    const debtId = 'xxxxxx-xxxxxx-xxxx-xxxx';

    const response = await requester.delete(`/debt/${debtId}`).set('Authorization', `Bearer ${access_token}`);

    expect(response, 'Invalid status code').to.have.status(400);
    expect(response.body, 'error property not found').to.have.property('error');
    expect(response).to.matchApiSchema();
  });

  it('should return a 400 error if the debt exists but is not owner by that account', async function () {
    const requester = getRequester();

    const userA = await Utils.factories.AccountFactory();
    const userB = await Utils.factories.AccountFactory();
    const debt = await Utils.factories.DebtFactory({account_id: userB.id});

    const access_token = await userA.email_providers[0].getToken({id: userA.id});

    const response = await requester.delete(`/debt/${debt.public_id}`).set('Authorization', `Bearer ${access_token}`);

    expect(response, 'Invalid status code').to.have.status(400);
    expect(response.body, 'error property not found').to.have.property('error');
    expect(response).to.matchApiSchema();
  });

  it('should delete the debt', async function () {
    const requester = getRequester();

    const user = await Utils.factories.AccountFactory();
    const debt = await Utils.factories.DebtFactory({account_id: user.id});

    const access_token = await user.email_providers[0].getToken({id: user.id});

    const response = await requester.delete(`/debt/${debt.public_id}`).set('Authorization', `Bearer ${access_token}`);

    const removedDate = await Utils.factories.DebtFactory.findByPublicId(debt.public_id);

    expect(response, 'Invalid status code').to.have.status(200);
    expect(response.body, 'result property not found').to.have.property('result');
    expect(response.body.result, 'id of the deleted debt must be its public id').to.have.property('id', debt.public_id);
    expect(response.body.result.id, 'id of the deleted debt must be an uuid').to.have.lengthOf(36);
    expect(removedDate, 'The debt should be deleted').to.be.null;
    expect(response).to.matchApiSchema();
  });

  it('should be a soft delete', async function () {
    const requester = getRequester();

    const user = await Utils.factories.AccountFactory();
    const debt = await Utils.factories.DebtFactory({account_id: user.id});

    const access_token = await user.email_providers[0].getToken({id: user.id});

    const response = await requester.delete(`/debt/${debt.public_id}`).set('Authorization', `Bearer ${access_token}`);

    const removedDate = await Utils.factories.DebtFactory.findByPublicIdParanoid(debt.public_id);

    expect(response, 'Invalid status code').to.have.status(200);
    expect(removedDate, 'The debt should be deleted').not.to.be.null;
    expect(response).to.matchApiSchema();
  });
});
