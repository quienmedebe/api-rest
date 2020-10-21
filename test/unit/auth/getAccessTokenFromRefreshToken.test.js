const {expect} = require('chai');
const sinon = require('sinon');
const Auth = require('../../../src/modules/auth');
const Database = require('../../../src/database');
const Utils = require('../../utils');

let databaseMock;

describe('Auth -> getAccessTokenFromRefreshToken', function () {
  beforeEach(function () {
    databaseMock = sinon.stub(Database.functions.auth, 'getAccountFromId');
  });

  afterEach(function () {
    databaseMock.restore();
  });

  it('should return an error if the account id is not valid');

  it('should return an error if the refresh token is not valid');

  it('should return the access token if no error is thrown');
});
