const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chaiArrays = require('chai-arrays');
const matchApiSchema = require('api-contract-validator').chaiPlugin;
const path = require('path');
const apiSpec = path.join(__dirname, '../../../swagger.json');
const Utils = require('../../utils');

const {setup, tearDown, getRequester} = Utils.integration;

const expect = chai.expect;
chai.use(chaiHttp);
chai.use(sinonChai);
chai.use(chaiArrays);
chai.use(matchApiSchema({apiDefinitionsPath: apiSpec}));

let emailStrategy;

describe.only('/auth/new-password', function () {
  beforeEach(async function () {
    // eslint-disable-next-line mocha/no-nested-tests
    await setup();
  });

  afterEach(function () {
    sinon.reset();
    tearDown();
  });

  it('should return an error if the parameters are missing', async function () {
    const requester = getRequester();

    const response = await requester.post('/auth/new-password');

    expect(response, 'Invalid status code').to.have.status(400);
    expect(response.body).to.have.property('error');
    expect(response, 'Wrong API documentation').to.matchApiSchema();
  });

  it('should return an error if the token or emailProviderId are invalid', async function () {
    const requester = getRequester();

    const body = {
      emailProviderId: 1,
      token: '1'.repeat(64),
      newPassword: '1234567890',
    };

    const response = await requester.post('/auth/new-password').send(body);

    expect(response, 'Invalid status code').to.have.status(400);
    expect(response.body).to.have.property('error');
    expect(response, 'Wrong API documentation').to.matchApiSchema();
  });

  it('should be able to log in with the new password and not with the old one', async function () {
    const requester = getRequester();
    const oldPassword = '1234567890';
    const newPassword = '0987654321';

    const account = await Utils.factories.AccountFactory();
    const emailProvider = await Utils.factories.EmailProviderFactory({account_id: account.id, password: oldPassword});
    const emailToken = await Utils.factories.EmailProviderFactory({email_provider_id: emailProvider.id});
    const body = {
      emailProviderId: emailProvider.id,
      token: emailToken.id,
      newPassword: newPassword,
    };

    const responseChangePassword = await requester.post('/auth/new-password').send(body);

    const bodyOldPassword = {
      email: emailProvider.email,
      password: oldPassword,
    };
    const bodyNewPassword = {
      email: emailProvider.email,
      password: newPassword,
    };
    const responseOldPassword = await requester.post('/auth/login').send(bodyOldPassword);
    const responseNewPassword = await requester.post('/auth/login').send(bodyNewPassword);

    expect(responseChangePassword, 'Invalid status code').to.have.status(200);

    expect(responseOldPassword).to.have.status(401);
    expect(responseNewPassword).to.have.status(200);
    expect(responseChangePassword, 'Wrong API documentation').to.matchApiSchema();
  });

  it('should not be able to change the password with the same token twice', async function () {
    const requester = getRequester();
    const newPassword = '0987654321';

    const account = await Utils.factories.AccountFactory();
    const emailProvider = await Utils.factories.EmailProviderFactory({account_id: account.id});
    const emailToken = await Utils.factories.EmailProviderFactory({email_provider_id: emailProvider.id}, false);
    const body = {
      emailProviderId: emailProvider.id,
      token: emailToken.id,
      newPassword: newPassword,
    };

    const responseSuccess = await requester.post('/auth/new-password').send(body);
    const responseFail = await requester.post('/auth/new-password').send(body);

    await emailToken.reload();

    expect(responseSuccess).to.have.status(200);
    expect(responseFail).to.have.status(400);
    expect(emailToken.valid).to.be.false;
  });
});