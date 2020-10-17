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

describe.skip('/auth/refresh', function () {
  beforeEach(async function () {
    // eslint-disable-next-line mocha/no-nested-tests
    await setup();
  });

  afterEach(function () {
    tearDown();
  });

  it('should return a new access token if the refresh token exists in the database, is not expired, is not invalidated and the account id is correct', async function () {
    const requester = getRequester();

    await Utils.factories.AccountFactory();
    const body = {
      refreshToken: 'valid_refresh_token',
    };

    await requester.post('/auth/refresh').send(body);
  });
});
