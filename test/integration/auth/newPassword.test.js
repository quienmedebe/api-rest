const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chaiArrays = require('chai-arrays');
const matchApiSchema = require('api-contract-validator').chaiPlugin;
const path = require('path');
const apiSpec = path.join(__dirname, '../../../swagger.json');
const Utils = require('../../utils');

const {prepare, tearDown, getRequester} = Utils.integration;

const expect = chai.expect;
chai.use(chaiHttp);
chai.use(sinonChai);
chai.use(chaiArrays);
chai.use(matchApiSchema({apiDefinitionsPath: apiSpec}));

describe('/auth/new-password', function () {
  beforeEach(async function () {
    Utils.Stubs.Config.SALT_NUMBER(4);
    sinon.stub(Date, 'now').returns(1000);
    await prepare();
  });

  afterEach(function () {
    sinon.restore();
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
    const emailToken = await Utils.factories.EmailTokenFactory({email_provider_id: emailProvider.id});
    const body = {
      emailProviderId: emailProvider.public_id,
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
    const emailToken = await Utils.factories.EmailTokenFactory({email_provider_id: emailProvider.id}, false);
    const body = {
      emailProviderId: emailProvider.public_id,
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

  it('should return an error if the token is valid but it is owned by another provider', async function () {
    const requester = getRequester();
    const newPassword = '0987654321';

    const accountA = await Utils.factories.AccountFactory();
    const accountB = await Utils.factories.AccountFactory();
    const emailProviderA = await Utils.factories.EmailProviderFactory({account_id: accountA.id});
    const emailProviderB = await Utils.factories.EmailProviderFactory({account_id: accountB.id});
    const emailToken = await Utils.factories.EmailTokenFactory({email_provider_id: emailProviderA.id}, false);
    const body = {
      emailProviderId: emailProviderB.public_id,
      token: emailToken.id,
      newPassword: newPassword,
    };

    const response = await requester.post('/auth/new-password').send(body);

    expect(response).to.have.status(400);
    expect(response).to.have.property('error');
  });

  it('should return an error if the token has expired', async function () {
    const requester = getRequester();
    const newPassword = '0987654321';

    const account = await Utils.factories.AccountFactory();
    const emailProvider = await Utils.factories.EmailProviderFactory({account_id: account.id});
    const emailToken = await Utils.factories.EmailTokenFactory({email_provider_id: emailProvider.id, expiration_datetime: 900}, false);
    const body = {
      emailProviderId: emailProvider.public_id,
      token: emailToken.id,
      newPassword: newPassword,
    };

    const response = await requester.post('/auth/new-password').send(body);

    expect(response).to.have.status(400);
    expect(response).to.have.property('error');
  });

  it('should return an error if the email provider id is the private one', async function () {
    const requester = getRequester();
    const newPassword = '0987654321';

    const account = await Utils.factories.AccountFactory();
    const emailProvider = await Utils.factories.EmailProviderFactory({account_id: account.id});
    const emailToken = await Utils.factories.EmailTokenFactory({email_provider_id: emailProvider.id, expiration_datetime: 900}, false);

    const body = {
      emailProviderId: +emailProvider.id,
      token: emailToken.id,
      newPassword: newPassword,
    };

    const response = await requester.post('/auth/new-password').send(body);

    expect(response, 'Invalid status code').to.have.status(400);
    expect(response.body).to.have.property('error');
    expect(response, 'Wrong API documentation').to.matchApiSchema();
  });
});
