const chai = require('chai');
const chaiHttp = require('chai-http');
const matchApiSchema = require('api-contract-validator').chaiPlugin;
const path = require('path');
const apiSpec = path.join(__dirname, '../../../swagger.json');
const {prepare, tearDown, getRequester} = require('../../utils/integration');
const Utils = require('../../utils');

const expect = chai.expect;
chai.use(chaiHttp);
chai.use(matchApiSchema({apiDefinitionsPath: apiSpec}));

let SALT_NUMBER;

describe('/auth/signup', function () {
  beforeEach(async function () {
    SALT_NUMBER = Utils.Stubs.Config.SALT_NUMBER(Utils.constants.SALT_NUMBER);
    await prepare();
  });
  afterEach(function () {
    SALT_NUMBER.restore();

    tearDown();
  });

  it('should return a 200 status when a user signups with email and password when all parameters are correct @integration @auth @signup', async function () {
    const requester = getRequester();

    const signupBody = {
      email: 'test@example.com',
      password: 'P4ssW0rD!',
    };
    const response = await requester.post('/auth/signup').send(signupBody);

    expect(response, 'Wrong status code').to.have.status(200);
    expect(response.body, 'access_token property not found').to.have.property('access_token');
    expect(response.body, 'refresh_token property not found').to.have.property('refresh_token');

    expect(response, 'Wrong API documentation').to.matchApiSchema();
  });

  it('should return a 400 status on a invalid request @integration @auth @signup', async function () {
    const requester = getRequester();

    const wrongPasswordBody = {
      email: 'test@example.com',
      password: '',
    };
    const wrongEmailBody = {
      email: 'test@',
      password: '123456',
    };
    const notMinimumPasswordLength = {
      email: 'test@example.com',
      password: '12345',
    };
    const notMaximumPasswordLength = {
      email: 'test@example.com',
      password: '1'.repeat(256),
    };

    const wrongPasswordResponse = await requester.post('/auth/signup').send(wrongPasswordBody);
    const wrongEmailResponse = await requester.post('/auth/signup').send(wrongEmailBody);
    const wrongPasswordMinimumLengthResponse = await requester.post('/auth/signup').send(notMinimumPasswordLength);
    const wrongPasswordMaximumLengthResponse = await requester.post('/auth/signup').send(notMaximumPasswordLength);
    expect(wrongPasswordResponse, 'The wrong password response status is not correct').to.have.status(400);
    expect(wrongPasswordResponse.body, 'Should have an error property (wrong password response)').to.have.property('error');

    expect(wrongEmailResponse, 'The wrong email response status is not correct').to.have.status(400);
    expect(wrongEmailResponse.body, 'Should have an error property (wrong email response)').to.have.property('error');

    expect(wrongPasswordMinimumLengthResponse, 'The password length below minimum required status is not correct').to.have.status(400);
    expect(wrongPasswordMinimumLengthResponse.body, 'Should have an error property (password length below minimum required)').to.have.property('error');

    expect(wrongPasswordMaximumLengthResponse, 'The password length above maximum length status is not correct').to.have.status(400);
    expect(wrongPasswordMaximumLengthResponse.body, 'Should have an error property (password length above maximum length)').to.have.property('error');

    expect(wrongPasswordResponse, 'Wrong API documentation').to.matchApiSchema();
  });

  it('should return a 400 status if the email already exists @integration @auth @signup', async function () {
    const requester = getRequester();
    const user = await Utils.factories.AccountFactory();

    const body = {
      email: user.email_providers[0].email,
      password: '123456',
    };

    const response = await requester.post('/auth/signup').send(body);

    expect(response, 'Invalid status code').to.have.status(400);
    expect(response.body, 'Invalid error code').to.have.property('error', 'DUPLICATE_EMAIL');

    expect(response, 'Wrong API documentation').to.matchApiSchema();
  });
});
