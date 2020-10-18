const chai = require('chai');
const chaiHttp = require('chai-http');
const matchApiSchema = require('api-contract-validator').chaiPlugin;
const path = require('path');
const apiSpec = path.join(__dirname, '../../../swagger.json');
const {setup, tearDown, getRequester} = require('../../utils/integration');
const Stubs = require('../../utils/stubs');

const expect = chai.expect;
chai.use(chaiHttp);
chai.use(matchApiSchema({apiDefinitionsPath: apiSpec}));

let SALT_NUMBER;

describe('/auth/login', function () {
  beforeEach(async function () {
    SALT_NUMBER = Stubs.Config.SALT_NUMBER(1);
    // eslint-disable-next-line mocha/no-nested-tests
    await setup();
  });
  afterEach(function () {
    SALT_NUMBER.restore();

    tearDown();
  });

  it('should return 200 and return the access_token if the user authenticates successfully @integration @auth @login', async function () {
    const requester = getRequester();
    const body = {
      email: 'test@example.com',
      password: '123456',
    };

    await requester.post('/auth/signup').send(body);
    const loginResponse = await requester.post('/auth/login').send(body);

    expect(loginResponse, 'The status code is incorrect').to.have.status(200);
    expect(loginResponse.body, 'access_token not found on body response').to.have.property('access_token');

    expect(loginResponse, 'Wrong API documentation').to.matchApiSchema();
  });

  it('should return 401 if the user does not exist on the database @integration @auth @login', async function () {
    const requester = getRequester();
    const body = {
      email: 'test@example.com',
      password: '123456',
    };

    const loginResponse = await requester.post('/auth/login').send(body);

    expect(loginResponse, 'The status code is incorrect').to.have.status(401);

    expect(loginResponse, 'Wrong API documentation').to.matchApiSchema();
  });
});
