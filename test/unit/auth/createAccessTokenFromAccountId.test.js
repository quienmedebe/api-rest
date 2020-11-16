const {expect} = require('chai');
const sinon = require('sinon');
const createAccessTokenFromAccountId = require('../../../src/modules/auth/functions/createAccessTokenFromAccountId');
const Database = require('../../../src/database');
const Utils = require('../../utils');

let databaseMock;

describe('Auth -> createAccessTokenFromAccountId', function () {
  beforeEach(function () {
    databaseMock = sinon.stub(Database.functions.auth, 'getAccountFromId');
  });

  afterEach(function () {
    databaseMock.restore();
  });

  it('should return an account not found error if there is not an account', async function () {
    databaseMock.returns(null);

    const config = {
      secret: '1234',
      logger: () => {},
    };

    const accessToken = await createAccessTokenFromAccountId(1, config);

    expect(accessToken).to.have.property('error');
  });

  it('should return the access token after creation', async function () {
    databaseMock.returns({
      id: 1,
      public_id: Utils.constants.PUBLIC_ID,
    });

    const config = {
      secret: '1234',
      logger: () => {},
    };

    const response = await createAccessTokenFromAccountId(1, config);

    expect(response).to.have.property('accessToken');
  });
});
