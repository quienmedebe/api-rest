const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');
const proxyquire = require('proxyquire');
const {makeMockModels} = require('sequelize-test-helpers');

chai.use(sinonChai);
chai.use(chaiAsPromised);

const mockModels = makeMockModels({
  RefreshToken: {
    create: sinon.stub(),
  },
});

const createRefreshToken = proxyquire('../../../../src/database/functions/auth/createRefreshToken.js', {
  '../../models': mockModels,
});

const resetStubs = () => {
  mockModels.RefreshToken.create.resetHistory();
};

describe('Database -> createRefreshToken', function () {
  it('should create a refresh token', async function () {
    const createdRefreshToken = {
      id: 1,
      account_id: 1,
      expiration_datetime: 2000,
      valid: 0,
      issued_tokens: 0,
    };

    mockModels.RefreshToken.create.resolves(createdRefreshToken);
    const DateMock = sinon.stub(Date, 'now').callsFake(() => 1000);

    const refreshTokenOptions = {
      expiration_datetime: 1000,
    };

    const account = await createRefreshToken(1, refreshTokenOptions);

    expect(mockModels.RefreshToken.create, 'DB not called').to.have.been.calledOnce;
    expect(account, 'Invalid id').to.have.property('id', createdRefreshToken.id);
    expect(account, 'Invalid account id').to.have.property('account_id', createdRefreshToken.account_id);
    expect(account, 'Invalid expiration datetime').to.have.property('expiration_datetime', createdRefreshToken.expiration_datetime);
    expect(account, 'Invalid refresh token state').to.have.property('valid', createdRefreshToken.valid);
    expect(account, 'Invalid issued tokens count').to.have.property('issued_tokens', createdRefreshToken.issued_tokens);

    DateMock.restore();
    resetStubs();
  });

  it('should create the token if the expiration datetime is null', async function () {
    const createdRefreshToken = {
      id: 1,
      account_id: 1,
      expiration_datetime: null,
      valid: 0,
      issued_tokens: 0,
    };

    mockModels.RefreshToken.create.resolves(createdRefreshToken);

    const refreshTokenOptions = {
      expiration_datetime: null,
    };

    const account = await createRefreshToken(1, refreshTokenOptions);

    expect(mockModels.RefreshToken.create, 'DB not called').to.have.been.calledOnce;
    expect(account, 'Invalid id').to.have.property('id', createdRefreshToken.id);
    expect(account, 'Invalid account id').to.have.property('account_id', createdRefreshToken.account_id);
    expect(account, 'Invalid expiration datetime').to.have.property('expiration_datetime', createdRefreshToken.expiration_datetime);
    expect(account, 'Invalid refresh token state').to.have.property('valid', createdRefreshToken.valid);
    expect(account, 'Invalid issued tokens count').to.have.property('issued_tokens', createdRefreshToken.issued_tokens);

    resetStubs();
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
