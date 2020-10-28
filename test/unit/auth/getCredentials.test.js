const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const getCredentials = require('../../../src/modules/auth/functions/getCredentials');
const getAccessTokenFromRefreshToken = require('../../../src/modules/auth/functions/getAccessTokenFromRefreshToken');
const Database = require('../../../src/database');
const Utils = require('../../utils');

chai.use(chaiAsPromised);

const expect = chai.expect;

let getActiveRefreshTokenFromAccountMock, createRefreshTokenMock, getAccessTokenFromRefreshTokenMock;

describe('Auth -> getCredentials', function () {
  beforeEach(function () {
    getActiveRefreshTokenFromAccountMock = sinon.stub(Database.functions.auth, 'getActiveRefreshTokenFromAccount');
    createRefreshTokenMock = sinon.stub(Database.functions.auth, 'createRefreshToken');
    getAccessTokenFromRefreshTokenMock = sinon.stub(getAccessTokenFromRefreshToken, 'getAccessTokenFromRefreshToken');
  });

  afterEach(function () {
    getActiveRefreshTokenFromAccountMock.restore();
    createRefreshTokenMock.restore();
    getAccessTokenFromRefreshTokenMock.restore();
  });

  it('should return an error if the account id is not valid', function () {
    const accountId = 'not valid';
    const credentials = getCredentials(accountId);

    expect(credentials).to.be.rejected;
  });

  it('should return an access token from an old refresh token', async function () {
    getActiveRefreshTokenFromAccountMock.resolves({id: 'refresh_token'});
    getAccessTokenFromRefreshTokenMock.resolves({accessToken: 'access_token'});

    const credentials = await getCredentials(1, {accessTokenSecret: Utils.constants.ACCESS_TOKEN_SECRET});

    expect(credentials.accessToken).to.equal('access_token');
    expect(createRefreshTokenMock).not.to.have.been.calledOnce;
  });

  it('should return the refresh token', async function () {
    getActiveRefreshTokenFromAccountMock.resolves({id: 'refresh_token'});
    getAccessTokenFromRefreshTokenMock.resolves({accessToken: 'access_token'});

    const credentials = await getCredentials(1, {accessTokenSecret: Utils.constants.ACCESS_TOKEN_SECRET});

    expect(credentials.refreshToken).to.equal('refresh_token');
  });

  it('should return an access token from a new refresh token', async function () {
    getActiveRefreshTokenFromAccountMock.resolves(null);
    createRefreshTokenMock.resolves({id: 'refresh_token'});
    getAccessTokenFromRefreshTokenMock.resolves({accessToken: 'access_token'});

    await getCredentials(1, {accessTokenSecret: Utils.constants.ACCESS_TOKEN_SECRET});

    expect(createRefreshTokenMock).to.have.been.calledOnce;
  });

  it('should be rejected if the account id is not valid', async function () {
    const response = getCredentials('1', {accessTokenSecret: Utils.constants.ACCESS_TOKEN_SECRET});

    expect(response).to.have.rejected;
  });

  it('should return an error if getting the access token from a refresh token has failed', async function () {
    getActiveRefreshTokenFromAccountMock.resolves(null);
    createRefreshTokenMock.resolves({id: 'refresh_token'});
    getAccessTokenFromRefreshTokenMock.resolves({error: 'REFRESH_TOKEN_NOT_FOUND', message: 'Refresh token not found', status: 400});

    const response = await getCredentials(1, {accessTokenSecret: Utils.constants.ACCESS_TOKEN_SECRET});

    expect(response).to.have.property('error', 'REFRESH_TOKEN_NOT_FOUND');
  });
});
