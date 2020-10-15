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

describe('/auth/check', function () {
  beforeEach(async function () {
    // eslint-disable-next-line mocha/no-nested-tests
    await setup();
  });
  afterEach(function () {
    tearDown();
  });

  it('should return 200 and the contents of the valid token @integration @auth @check', async function () {
    const requester = getRequester();
    const user = await Utils.factories.AccountFactory({}, true, {withEmail: true});

    const {access_token} = await user.email_providers[0].getToken(requester);

    const response = await requester.post('/auth/check').set('Authorization', `Bearer ${access_token}`);

    expect(response, 'The status code is incorrect').to.have.status(200);
    expect(response.body, 'The account id is incorrect').to.have.property('id', +user.id);
  });

  it('should return a 401 error if the token is invalid @integration @auth @check', async function () {
    const requester = getRequester();

    const response = await requester.post('/auth/check').set('Authorization', `Bearer myinvalid.token`);

    expect(response, 'The status code is incorrect').to.have.status(401);
    expect(response.body, 'The error code is incorrect').to.have.property('error', 'UNAUTHORIZED');
  });
});
