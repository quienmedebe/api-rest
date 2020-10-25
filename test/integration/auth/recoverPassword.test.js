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

describe('/auth/recover-password', function () {
  beforeEach(async function () {
    // eslint-disable-next-line mocha/no-nested-tests
    await setup();

    emailStrategy = {
      sendEmail: sinon.stub(),
    };
    Email.useStrategy(emailStrategy);
  });

  afterEach(function () {
    sinon.reset();
    tearDown();
  });

  it('should return an error if the email is not set', async function () {
    emailStrategy.sendEmail.resolves([]);
    const requester = getRequester();

    const response = await requester.post('/auth/recover-password');

    expect(response, 'Invalid status code').to.have.status(400);
    expect(response.body).to.have.property('error');
    expect(emailStrategy.sendEmail).not.to.have.been.called;
    expect(response, 'Wrong API documentation').to.matchApiSchema();
  });

  it('should return an error if the email does not exist', async function () {
    emailStrategy.sendEmail.resolves([]);
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
    const requester = getRequester();

    const emailProvider = await Utils.factories.EmailProviderFactory({}, false);
    const body = {
      email: emailProvider.email,
    };
    emailStrategy.sendEmail.resolves([{email: emailProvider.email}]);

    const response = await requester.post('/auth/recover-password').send(body);

    const tokens = await Utils.factories.EmailTokenFactory.findAll();

    expect(response, 'Invalid status code').to.have.status(200);
    expect(response.body.result).to.be.array();
    expect(response.body.result).to.be.ofSize(1);
    expect(emailStrategy.sendEmail).to.have.been.calledOnce;
    expect(tokens).to.be.ofSize(1);
    expect(tokens[0]).to.have.property('valid', true);
    expect(response, 'Wrong API documentation').to.matchApiSchema();
  });

  it('should not create a new token if there is one already valid', async function () {
    const requester = getRequester();

    const emailProvider = await Utils.factories.EmailProviderFactory({}, false);
    const token = await Utils.factories.EmailTokenFactory({email_provider_id: emailProvider.id});
    const body = {
      email: emailProvider.email,
    };
    emailStrategy.sendEmail.resolves([{email: emailProvider.email}]);

    const response = await requester.post('/auth/recover-password').send(body);

    const tokens = await Utils.factories.EmailTokenFactory.findAll();

    expect(response, 'Invalid status code').to.have.status(200);
    expect(response.body.result).to.be.array();
    expect(response.body.result).to.be.ofSize(1);
    expect(emailStrategy.sendEmail).to.have.been.calledOnce;
    expect(tokens).to.be.ofSize(1);
    expect(tokens[0].id).to.equal(token.id);
    expect(response, 'Wrong API documentation').to.matchApiSchema();
  });
});
