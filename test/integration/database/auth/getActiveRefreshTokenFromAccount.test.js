const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;
const Utils = require('../../../utils');
const Database = require('../../../../src/database');

let mockDate;

describe('Database -> getActiveRefreshTokenFromAccount', function () {
  beforeEach(async function () {
    mockDate = sinon.stub(Date, 'now').returns(1000);
    await Utils.scripts.truncateDB();
  });

  afterEach(function () {
    mockDate.restore();
  });

  it('should return a success response with the refresh token if it exists', async function () {
    const account = await Utils.factories.AccountFactory();
    const refreshToken = await Utils.factories.RefreshTokenFactory({account_id: account.id});
    const savedRefreshToken = await Database.functions.auth.getActiveRefreshTokenFromAccount(+account.id);

    expect(savedRefreshToken).to.have.property('id', refreshToken.id);
  });

  it('should return null if the refresh token has expired', async function () {
    const account = await Utils.factories.AccountFactory();
    await Utils.factories.RefreshTokenFactory({account_id: account.id, expiration_datetime: 900});
    const savedRefreshToken = await Database.functions.auth.getActiveRefreshTokenFromAccount(+account.id);

    expect(savedRefreshToken).to.be.null;
  });

  it('should return null if the refresh token has been invalidated', async function () {
    const account = await Utils.factories.AccountFactory();
    await Utils.factories.RefreshTokenFactory({account_id: account.id, valid: false});
    const savedRefreshToken = await Database.functions.auth.getActiveRefreshTokenFromAccount(+account.id);

    expect(savedRefreshToken).to.be.null;
  });

  it('should return the refresh token with expiration date if two are present but one of them has null as a expiration date', async function () {
    const account = await Utils.factories.AccountFactory();
    const refreshToken = await Utils.factories.RefreshTokenFactory({account_id: account.id, expiration_datetime: 1100});
    await Utils.factories.RefreshTokenFactory({account_id: account.id, expiration_datetime: null});
    const savedRefreshToken = await Database.functions.auth.getActiveRefreshTokenFromAccount(+account.id);

    expect(savedRefreshToken).to.have.property('id', refreshToken.id);
  });

  it('should return the refresh token with less left time to expiration', async function () {
    const account = await Utils.factories.AccountFactory();
    const refreshToken = await Utils.factories.RefreshTokenFactory({account_id: account.id, expiration_datetime: 1050});
    await Utils.factories.RefreshTokenFactory({account_id: account.id, expiration_datetime: 1100});
    const savedRefreshToken = await Database.functions.auth.getActiveRefreshTokenFromAccount(+account.id);

    expect(savedRefreshToken).to.have.property('id', refreshToken.id);
  });

  it('should return null if the refresh token does not exist', async function () {
    const account = await Database.functions.auth.getActiveRefreshTokenFromAccount(2);

    expect(account).to.be.null;
  });

  it('should reject if the id is not a number', function () {
    const result = Database.functions.auth.getActiveRefreshTokenFromAccount('abc');
    expect(result).to.be.rejectedWith(Error);
  });
});
