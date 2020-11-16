const chai = require('chai');
const chaiHttp = require('chai-http');
const matchApiSchema = require('api-contract-validator').chaiPlugin;
const path = require('path');
const jwt = require('jsonwebtoken');
const apiSpec = path.join(__dirname, '../../../swagger.json');
const Utils = require('../../utils');

const {prepare, tearDown, getRequester} = Utils.integration;

const expect = chai.expect;
chai.use(chaiHttp);
chai.use(matchApiSchema({apiDefinitionsPath: apiSpec}));

describe('/auth/login', function () {
  beforeEach(async function () {
    await prepare();
  });
  afterEach(function () {
    tearDown();
  });

  it('should return 200 and return the access_token if the user authenticates successfully @integration @auth @login', async function () {
    const requester = getRequester();
    const user = await Utils.factories.AccountFactory();

    const body = {
      email: user.email_providers[0].email,
      password: Utils.constants.PASSWORD,
    };

    const loginResponse = await requester.post('/auth/login').send(body);

    expect(loginResponse, 'The status code is incorrect').to.have.status(200);
    expect(loginResponse.body, 'access_token not found on body response').to.have.property('access_token');
    expect(loginResponse.body, 'refresh_token not found on body response').to.have.property('refresh_token');

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

  it('should contain the public id as id inside the token', async function () {
    const requester = getRequester();
    const user = await Utils.factories.AccountFactory();

    const body = {
      email: user.email_providers[0].email,
      password: Utils.constants.PASSWORD,
    };

    const loginResponse = await requester.post('/auth/login').send(body);

    const accessToken = loginResponse.body.access_token;

    const decodedToken = jwt.decode(accessToken);

    expect(decodedToken).to.have.property('id', user.public_id);
  });
});
