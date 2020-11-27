const {expect} = require('chai');
const sinon = require('sinon');
const noopLogger = require('noop-logger');
const getAccessAndRefreshTokenFromAccountId = require('../../../src/modules/auth/functions/getAccessAndRefreshTokenFromAccountId');
const getCredentials = require('../../../src/modules/auth/functions/getCredentials');

let getCredentialsMock;

describe('Auth -> getAccessAndRefreshTokenFromAccountId', function () {
  beforeEach(function () {
    getCredentialsMock = sinon.stub(getCredentials, 'getCredentials');
  });

  afterEach(function () {
    getCredentialsMock.restore();
  });

  it('should return the access and refresh token', async function () {
    getCredentialsMock.returns({
      accessToken: '1234',
      refreshToken: '4321',
    });

    const config = {
      accessTokenSecret: '1234',
      accessTokenExpirationTimeSeconds: '1234',
      refreshTokenExpirationTimeMs: '1234',
      logger: noopLogger,
    };

    const accessToken = await getAccessAndRefreshTokenFromAccountId(1, config);

    expect(accessToken).to.have.property('access_token', '1234');
    expect(accessToken).to.have.property('refresh_token', '4321');
  });

  it('should return the access token after creation', async function () {
    getCredentialsMock.returns({
      error: 'SOME_ERROR',
      message: 'Some error has happened',
    });

    const config = {
      accessTokenSecret: '1234',
      accessTokenExpirationTimeSeconds: '1234',
      refreshTokenExpirationTimeMs: '1234',
      logger: noopLogger,
    };

    const response = await getAccessAndRefreshTokenFromAccountId(1, config);

    expect(response).to.have.property('error', 'SOME_ERROR');
    expect(response).to.have.property('message');
  });

  it('should return a rejected promise if the account id is not a number', async function () {
    const config = {
      accessTokenSecret: '1234',
      accessTokenExpirationTimeSeconds: '1234',
      refreshTokenExpirationTimeMs: '1234',
      logger: () => {},
    };

    const response = getAccessAndRefreshTokenFromAccountId(1, config);

    expect(response).to.be.rejected;
  });
});
