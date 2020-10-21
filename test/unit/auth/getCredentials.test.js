const {expect} = require('chai');
const sinon = require('sinon');
const Auth = require('../../../src/modules/auth');
const Database = require('../../../src/database');
const Utils = require('../../utils');

let databaseMock;

describe('Auth -> getCredentials', function () {
  beforeEach(function () {
    databaseMock = sinon.stub(Database.functions.auth, 'getAccountFromId');
  });

  afterEach(function () {
    databaseMock.restore();
  });

  it('should return an error if the account id is not valid');

  it('should return an access token from an old refresh token');

  it('should return an access token from a new refresh token');
});
