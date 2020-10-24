const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const matchApiSchema = require('api-contract-validator').chaiPlugin;
const path = require('path');
const apiSpec = path.join(__dirname, '../../../swagger.json');
const Utils = require('../../utils');
const Email = require('../../../src/services/email');

const {setup, tearDown, getRequester} = Utils.integration;

const expect = chai.expect;
chai.use(chaiHttp);
chai.use(sinonChai);
chai.use(matchApiSchema({apiDefinitionsPath: apiSpec}));

let sendEmailMock;

describe.only('/auth/recover-password', function () {
  beforeEach(async function () {
    sendEmailMock = sinon.stub(Email, 'sendEmail');
    // eslint-disable-next-line mocha/no-nested-tests
    await setup();
  });

  afterEach(function () {
    sendEmailMock.restore();
    tearDown();
  });

  it('should return an error if the email is not set', async function () {
    const requester = getRequester();

    const response = await requester.post('/auth/recover-password');

    expect(response, 'Invalid status code').to.have.status(400);
    expect(response.body).to.have.property('error');
    expect(sendEmailMock).not.to.have.been.called;
    expect(response, 'Wrong API documentation').to.matchApiSchema();
  });

  it('should return an error if the email does not exist', async function () {
    const requester = getRequester();

    const body = {
      email: 'notvalid@example.com',
    };

    const response = await requester.post('/auth/recover-password').send(body);

    expect(response, 'Invalid status code').to.have.status(400);
    expect(response.body).to.have.property('error');
    expect(sendEmailMock).not.to.have.been.called;
    expect(response, 'Wrong API documentation').to.matchApiSchema();
  });

  it('should send an email with the link to create a new password', async function () {
    sendEmailMock.callsFake(() => console.log('Email sendEmail faked'));
    const requester = getRequester();

    const account = await Utils.factories.AccountFactory();
    const body = {
      email: account.email_providers[0].email,
    };

    const response = await requester.post('/auth/recover-password').send(body);

    expect(response, 'Invalid status code').to.have.status(400);
    expect(response.body).to.have.property('error');
    expect(sendEmailMock).to.have.been.calledOnce;
    expect(response, 'Wrong API documentation').to.matchApiSchema();
  });
});
