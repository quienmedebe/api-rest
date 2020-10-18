const chai = require('chai');
const chaiHttp = require('chai-http');
const matchApiSchema = require('api-contract-validator').chaiPlugin;
const path = require('path');
const apiSpec = path.join(__dirname, '../../../swagger.json');
const Utils = require('../../utils');

const {setup, tearDown, getRequester} = Utils.integration;

const expect = chai.expect;
chai.use(chaiHttp);
chai.use(matchApiSchema({apiDefinitionsPath: apiSpec}));

let ACCESS_TOKEN_SECRET;

describe('/auth/check', function () {
  beforeEach(async function () {
    ACCESS_TOKEN_SECRET = Utils.Stubs.Config.ACCESS_TOKEN_SECRET(Utils.constants.ACCESS_TOKEN_SECRET);
    // eslint-disable-next-line mocha/no-nested-tests
    await setup();
  });
  afterEach(function () {
    ACCESS_TOKEN_SECRET.restore();

    tearDown();
  });

  it('should return 200 and the deserialized user of the valid token @integration @auth @check', async function () {
    const requester = getRequester();
    const user = await Utils.factories.AccountFactory();

    const access_token = await user.email_providers[0].getToken({id: user.id});

    const response = await requester.get('/auth/check').set('Authorization', `Bearer ${access_token}`);

    expect(response, 'The status code is incorrect').to.have.status(200);
    expect(response.body, 'The account id is incorrect').to.have.property('id', parseInt(user.id, 10));

    expect(response).to.matchApiSchema();
  });

  it('should return a 401 error if the token is invalid @integration @auth @check', async function () {
    const requester = getRequester();

    const response = await requester.get('/auth/check').set('Authorization', `Bearer myinvalid.token`);

    expect(response, 'The status code is incorrect').to.have.status(401);
    expect(response.body, 'The error code is incorrect').to.have.property('error', 'UNAUTHORIZED');

    expect(response).to.matchApiSchema();
  });

  it('should return a 401 error if the token has expired @integration @auth @check', async function () {
    const requester = getRequester();
    const user = await Utils.factories.AccountFactory();

    const access_token = await user.email_providers[0].getToken(null, {expiresIn: 1000 * 60 * 5});

    const response = await requester.get('/auth/check').set('Authorization', `Bearer ${access_token}`);

    expect(response, 'The status code is incorrect').to.have.status(200);
    expect(response.body, 'The account id is incorrect').to.have.property('id', parseInt(user.id, 10));

    expect(response).to.matchApiSchema();
  });
});
