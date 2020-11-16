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

describe('/auth/check', function () {
  beforeEach(async function () {
    ACCESS_TOKEN_SECRET = Utils.Stubs.Config.ACCESS_TOKEN_SECRET(Utils.constants.ACCESS_TOKEN_SECRET);
    await prepare();
  });
  afterEach(function () {
    ACCESS_TOKEN_SECRET.restore();

    tearDown();
  });

  it('should return 200 and the deserialized user of the valid token @integration @auth @check', async function () {
    const requester = getRequester();
    const user = await Utils.factories.AccountFactory();

    const access_token = await user.email_providers[0].getToken({id: user.public_id});

    const response = await requester.get('/auth/check').set('Authorization', `Bearer ${access_token}`);

    expect(response, 'The status code is incorrect').to.have.status(200);
    expect(response.body, 'The account id is incorrect').to.have.property('id', user.public_id);

    expect(response).to.matchApiSchema();
  });

  it('should return a 401 error if the token is invalid @integration @auth @check', async function () {
    const requester = getRequester();

    const response = await requester.get('/auth/check').set('Authorization', `Bearer myinvalid.token`);

    expect(response, 'The status code is incorrect').to.have.status(401);
    expect(response.body, 'The error code is incorrect').to.have.property('error', 'UNAUTHORIZED');

    expect(response).to.matchApiSchema();
  });

  it('should return 200 if the token has not expired @integration @auth @check', async function () {
    const requester = getRequester();
    const user = await Utils.factories.AccountFactory();

    const access_token = await user.email_providers[0].getToken({}, {expiresIn: 1000 * 60 * 5});

    const response = await requester.get('/auth/check').set('Authorization', `Bearer ${access_token}`);

    expect(response, 'The status code is incorrect').to.have.status(200);
    expect(response.body, 'The account id is incorrect').to.have.property('id');
    expect(response.body.id, 'The account id should be the public id').to.be.a('string');
    expect(response.body.id, 'The account id should have an uuid structure').to.have.lengthOf(36);

    expect(response).to.matchApiSchema();
  });

  it('should return a 401 error if the token is valid but it is not associated to an account @integration @auth @check', async function () {
    const requester = await getRequester();
    const token = Utils.Functions.getSignedToken(Utils.constants.PUBLIC_ID)();

    const response = await requester.get('/auth/check').set('Authorization', `Bearer ${token}`);

    expect(response, 'The status code is incorrect').to.have.status(401);
    expect(response.body, 'The error code is incorrect').to.have.property('error', 'UNAUTHORIZED');

    expect(response).to.matchApiSchema();
  });
});
