const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chaiArrays = require('chai-arrays');
const matchApiSchema = require('api-contract-validator').chaiPlugin;
const path = require('path');
const apiSpec = path.join(__dirname, '../../../swagger.json');
const Utils = require('../../utils');
const Email = require('../../../src/services/email');

const {setup, tearDown, getRequester} = Utils.integration;

const expect = chai.expect;
chai.use(chaiHttp);
chai.use(sinonChai);
chai.use(chaiArrays);
chai.use(matchApiSchema({apiDefinitionsPath: apiSpec}));

let emailStrategy;

describe.only('/auth/recover-password', function () {
  beforeEach(async function () {
    emailStrategy = {
      sendEmail: sinon.stub(),
    };
    // eslint-disable-next-line mocha/no-nested-tests
    await setup();
  });

  afterEach(function () {
    sinon.reset();
    tearDown();
  });

  it('should return an error if the email is not set', async function () {
    Email.use(emailStrategy);
    emailStrategy.sendEmail.resolves(console.log('Faked email') || []);
    const requester = getRequester();

    const response = await requester.post('/auth/recover-password');

    expect(response, 'Invalid status code').to.have.status(400);
    expect(response.body).to.have.property('error');
    expect(emailStrategy.sendEmail).not.to.have.been.called;
    expect(response, 'Wrong API documentation').to.matchApiSchema();
  });

  it('should return an error if the email does not exist', async function () {
    Email.use(emailStrategy);
    emailStrategy.sendEmail.resolves(console.log('Faked email') || []);
    const requester = getRequester();

    const body = {
      email: 'notvalid@example.com',
    };

    const response = await requester.post('/auth/recover-password').send(body);

    expect(response, 'Invalid status code').to.have.status(400);
    expect(response.body).to.have.property('error');
    expect(emailStrategy.sendEmail).not.to.have.been.called;
    expect(response, 'Wrong API documentation').to.matchApiSchema();
  });

  it('should send an email and create a new valid token', async function () {
    Email.use(emailStrategy);
    const requester = getRequester();

    const emailProvider = await Utils.factories.EmailProviderFactory({}, false);
    const body = {
      email: emailProvider.email,
    };
    emailStrategy.sendEmail.resolves(console.log('Faked email') || [{email: emailProvider.email}]);

    const response = await requester.post('/auth/recover-password').send(body);

    await emailProvider.reload();

    expect(response, 'Invalid status code').to.have.status(200);
    expect(response.body.result).to.be.array();
    expect(response.body.result).to.be.ofSize(1);
    expect(emailStrategy.sendEmail).to.have.been.calledOnce;
    expect(emailProvider.tokens).to.be.ofSize(1);
    expect(emailProvider.tokens[0]).to.have.property('valid', true);
    expect(response, 'Wrong API documentation').to.matchApiSchema();
  });

  it('should not create a new token if there is one already valid', async function () {
    Email.use(emailStrategy);
    const requester = getRequester();

    const emailProvider = await Utils.factories.EmailProviderFactory({}, false);
    const token = await Utils.factories.EmailTokenFactory({email_provider_id: emailProvider.id});
    const body = {
      email: emailProvider.email,
    };
    emailStrategy.sendEmail.resolves(console.log('Faked email') || [{email: emailProvider.email}]);

    const response = await requester.post('/auth/recover-password').send(body);

    await emailProvider.reload();

    expect(response, 'Invalid status code').to.have.status(200);
    expect(response.body.result).to.be.array();
    expect(response.body.result).to.be.ofSize(1);
    expect(emailStrategy.sendEmail).to.have.been.calledOnce;
    expect(emailProvider.tokens).to.be.ofSize(1);
    expect(emailProvider.tokens.id).to.equal(token.id);
    expect(response, 'Wrong API documentation').to.matchApiSchema();
  });
});
