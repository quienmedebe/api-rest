const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const randToken = require('rand-token');
const Database = require('../../../src/database');
const Utils = require('../../utils');
const Auth = require('../../../src/modules/auth');

chai.use(chaiAsPromised);

let databaseMock;

describe('Auth -> getAccessTokenFromRefreshToken', function () {
  beforeEach(function () {
    databaseMock = sinon.stub(Database.functions.auth, 'getAccountFromId');
  });

  afterEach(function () {
    databaseMock.restore();
  });

  it('should return an error if the account id is not valid', function () {
    const accountId = 'not a number';
    const refreshToken = randToken.uid(255);
    const accessToken = Auth.functions.getAccessTokenFromRefreshToken(accountId, refreshToken, {secret: Utils.constants.ACCESS_TOKEN_SECRET});

    expect(accessToken).to.be.rejected;
  });

  it('should return an error if the refresh token is not valid', function () {
    const accountId = 1;
    const refreshToken = null;
    const accessToken = Auth.functions.getAccessTokenFromRefreshToken(accountId, refreshToken, {secret: Utils.constants.ACCESS_TOKEN_SECRET});

    expect(accessToken).to.be.rejected;
  });

  it('should return an error if the refresh token is not found', async function () {
    databaseMock.resolves(null);

    const accountId = 1;
    const refreshToken = randToken.uid(255);
    const accessToken = await Auth.functions.getAccessTokenFromRefreshToken(accountId, refreshToken, {secret: Utils.constants.ACCESS_TOKEN_SECRET});

    expect(accessToken).to.have.property('error');
  });

  it('should return the access token if there are no problems');
});
