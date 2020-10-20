const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');
const createRefreshToken = require('../../../../src/database/functions/auth/createRefreshToken');
const Utils = require('../../../utils');

chai.use(sinonChai);
chai.use(chaiAsPromised);

let mockDate;

describe('Database -> createRefreshToken', function () {
  beforeEach(async function () {
    mockDate = sinon.stub(Date, 'now').returns(1000);
    await Utils.scripts.truncateDB();
  });

  afterEach(function () {
    mockDate.restore();
  });

  it('should create a refresh token', async function () {
    const account = await Utils.factories.AccountFactory();
    const refreshTokenOptions = {
      expiration_datetime: 1000,
    };

    await createRefreshToken(+account.id, refreshTokenOptions);
    const token = await Utils.factories.RefreshTokenFactory.findByAccountId(account.id);

    expect(token).not.to.be.undefined;
    expect(token).to.have.property('expiration_datetime', '2000');
  });

  it('should create the token if the expiration datetime is null', async function () {
    const account = await Utils.factories.AccountFactory();
    const refreshTokenOptions = {
      expiration_datetime: null,
    };

    await createRefreshToken(+account.id, refreshTokenOptions);
    const token = await Utils.factories.RefreshTokenFactory.findByAccountId(account.id);

    expect(token).not.to.be.undefined;
    expect(token).to.have.property('expiration_datetime', null);
  });

  it('should reject if the expiration datetime is not a number', function () {
    const refreshTokenOptions = {
      expiration_datetime: 'Not a number',
    };

    const account = createRefreshToken(1, refreshTokenOptions);

    expect(account).to.be.rejectedWith(Error);
  });

  it('should reject if the account id is not a number', function () {
    const account = createRefreshToken('Not a number', {});

    expect(account).to.be.rejectedWith(Error);
  });
});
