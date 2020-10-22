const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const randToken = require('rand-token');
const Database = require('../../../src/database');
const Utils = require('../../utils');
const createAccessTokenFromAccountId = require('../../../src/modules/auth/functions/createAccessTokenFromAccountId');
const getAccessTokenFromRefreshToken = require('../../../src/modules/auth/functions/getAccessTokenFromRefreshToken');

chai.use(chaiAsPromised);

let databaseMock, createAccessTokenFromAccountIdMock;

describe.only('Auth -> getAccessTokenFromRefreshToken', function () {
  beforeEach(function () {
    databaseMock = sinon.stub(Database.functions.auth, 'getRefreshToken');
    createAccessTokenFromAccountIdMock = sinon.stub(createAccessTokenFromAccountId, 'createAccessTokenFromAccountId');
  });

  afterEach(function () {
    databaseMock.restore();
    createAccessTokenFromAccountIdMock.restore();
  });

  it('should return an error if the account id is not valid', function () {
    const accountId = 'not a number';
    const refreshToken = randToken.uid(255);
    const accessToken = getAccessTokenFromRefreshToken(accountId, refreshToken, {secret: Utils.constants.ACCESS_TOKEN_SECRET});

    expect(accessToken).to.be.rejected;
  });

  it('should return an error if the refresh token is not valid', function () {
    const accountId = 1;
    const refreshToken = null;
    const accessToken = getAccessTokenFromRefreshToken(accountId, refreshToken, {secret: Utils.constants.ACCESS_TOKEN_SECRET});

    expect(accessToken).to.be.rejected;
  });

  it('should return an error if the refresh token is not found', async function () {
    databaseMock.resolves(null);

    const accountId = 1;
    const refreshToken = randToken.uid(255);
    const accessToken = await getAccessTokenFromRefreshToken(accountId, refreshToken, {secret: Utils.constants.ACCESS_TOKEN_SECRET});

    expect(accessToken).to.have.property('error');
  });

  it('should return the access token if there are no problems', async function () {
    databaseMock.resolves({id: 'access_token', save: sinon.stub()});
    createAccessTokenFromAccountIdMock.resolves({accessToken: 'access_token'});

    const accountId = 1;
    const refreshToken = randToken.uid(255);
    const credentials = await getAccessTokenFromRefreshToken(accountId, refreshToken, {secret: Utils.constants.ACCESS_TOKEN_SECRET});

    expect(credentials).to.have.property('accessToken', 'access_token');
  });
});
