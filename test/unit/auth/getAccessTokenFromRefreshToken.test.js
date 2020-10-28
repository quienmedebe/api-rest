const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const randToken = require('rand-token');
const Database = require('../../../src/database');
const Utils = require('../../utils');
const getAccessTokenFromRefreshToken = require('../../../src/modules/auth/functions/getAccessTokenFromRefreshToken');
const createAccessTokenFromAccountId = require('../../../src/modules/auth/functions/createAccessTokenFromAccountId');

chai.use(chaiAsPromised);

let databaseMock, createAccessTokenFromAccountIdMock;

describe('Auth -> getAccessTokenFromRefreshToken', function () {
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

  it('should throw an error if the creation of the access token from the account id has returned an error', async function () {
    const error = {error: 'ACCOUNT_NOT_FOUND', message: 'Account not found', status: 400};
    databaseMock.resolves({id: 'access_token', save: sinon.stub()});
    createAccessTokenFromAccountIdMock.resolves(error);

    const accountId = 1;
    const refreshToken = randToken.uid(255);
    const response = await getAccessTokenFromRefreshToken(accountId, refreshToken, {secret: Utils.constants.ACCESS_TOKEN_SECRET});

    expect(response).to.have.property('error', 'ACCOUNT_NOT_FOUND');
  });
});
