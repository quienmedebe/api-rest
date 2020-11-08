const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;
const sinonChai = require('sinon-chai');
const chaiArrays = require('chai-arrays');
const chaiAsPromised = require('chai-as-promised');
const Database = require('../../../../src/database');
const Utils = require('../../../utils');

chai.use(sinonChai);
chai.use(chaiArrays);
chai.use(chaiAsPromised);

describe('Database -> Auth -> getRefreshToken', function () {
  beforeEach(async function () {
    await Utils.scripts.truncateDB();
    sinon.stub(Date, 'now').returns(1000);
  });

  afterEach(function () {
    sinon.restore();
  });

  it('should throw an error if the account id is not a number', function () {
    const result = Database.functions.auth.getRefreshToken('1', 'refresh_token');

    expect(result).to.be.rejected;
  });

  it('should throw an error if there is no refresh token', function () {
    const result = Database.functions.auth.getRefreshToken(1, null);

    expect(result).to.be.rejected;
  });

  it('should return null if there are no valid refresh tokens', async function () {
    const refreshToken = await Database.functions.auth.getRefreshToken(1, 'refresh_token');

    expect(refreshToken).to.be.null;
  });

  it('should return the refresh token if there is a valid one', async function () {
    const account = await Utils.factories.AccountFactory();
    const refreshToken = await Utils.factories.RefreshTokenFactory({account_id: account.id});

    const returnedToken = await Database.functions.auth.getRefreshToken(+account.id, refreshToken.id);

    expect(returnedToken.id).to.equal(refreshToken.id);
  });

  it('should return null if the refresh token has expired', async function () {
    const account = await Utils.factories.AccountFactory();
    const refreshToken = await Utils.factories.RefreshTokenFactory({account_id: account.id, expiration_datetime: 900});

    const returnedToken = await Database.functions.auth.getRefreshToken(+account.id, refreshToken.id);

    expect(returnedToken).to.be.null;
  });

  it('should return null if the refresh token is invalidated', async function () {
    const account = await Utils.factories.AccountFactory();
    const refreshToken = await Utils.factories.RefreshTokenFactory({account_id: account.id, valid: false});

    const returnedToken = await Database.functions.auth.getRefreshToken(+account.id, refreshToken.id);

    expect(returnedToken).to.be.null;
  });
});
