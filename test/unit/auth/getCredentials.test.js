const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const Auth = require('../../../src/modules/auth');
const Database = require('../../../src/database');
const Utils = require('../../utils');

chai.use(chaiAsPromised);

const expect = chai.expect;

let getActiveRefreshTokenFromAccountMock, createRefreshTokenMock, getAccessTokenFromRefreshTokenMock;

describe.only('Auth -> getCredentials', function () {
  beforeEach(function () {
    getActiveRefreshTokenFromAccountMock = sinon.stub(Database.functions.auth, 'getActiveRefreshTokenFromAccount');
    createRefreshTokenMock = sinon.stub(Database.functions.auth, 'createRefreshToken');
    getAccessTokenFromRefreshTokenMock = sinon.stub(Auth.functions, 'getAccessTokenFromRefreshToken');
  });

  afterEach(function () {
    getActiveRefreshTokenFromAccountMock.restore();
    createRefreshTokenMock.restore();
    getAccessTokenFromRefreshTokenMock.restore();
  });

  it('should return an error if the account id is not valid', function () {
    const accountId = 'not valid';
    const credentials = Auth.functions.getCredentials(accountId);

    expect(credentials).to.be.rejected;
  });

  it('should return an access token from an old refresh token');

  it('should return an access token from a new refresh token');
});
