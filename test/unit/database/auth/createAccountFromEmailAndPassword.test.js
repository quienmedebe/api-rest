const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const proxyquire = require('proxyquire');
const {makeMockModels} = require('sequelize-test-helpers');
const {sequelize} = require('../../../../src/database/models');
const Utils = require('../../../utils');

chai.use(sinonChai);

const mockModels = makeMockModels({
  Account: {
    create: sinon.stub(),
  },
  EmailProvider: 'EmailProvider',
  sequelize: sequelize,
});

const createAccountFromEmailAndPassword = proxyquire('../../../../src/database/functions/auth/createAccountFromEmailAndPassword.js', {
  '../../models': mockModels,
  './emailExists': async email => await Promise.resolve(email === 'duplicatedEmail@example.com'),
});

const resetStubs = () => {
  mockModels.Account.create.resetHistory();
};

const createdAccount = {
  id: 1,
  email_providers: [
    {
      email: 'test@example.com',
      password: 'hashed_password',
    },
  ],
  created_at: new Date(Date.now()).toISOString(),
  updated_at: new Date(Date.now()).toISOString(),
  deleted_at: null,
};

const createdAccountWithAttributes = {
  custom_attr: '1234',
  ...createdAccount,
};

describe.only('createAccountFromEmailAndPassword', function () {
  it('should create an account from an email and a password', async function () {
    mockModels.Account.create.resolves(createdAccount);

    const account = await createAccountFromEmailAndPassword('test@example.com', 'hashed_password');

    const expectedResponse = Utils.Functions.parseResponse('OK', createdAccount);

    expect(mockModels.Account.create).to.have.been.calledOnce;
    expect(account).to.deep.equal(expectedResponse);

    resetStubs();
  });

  it('should return an error response if the user already exists', async function () {
    const account = await createAccountFromEmailAndPassword('duplicatedEmail@example.com', 'hashed_password');

    const expectedResponse = Utils.Functions.parseResponse('ERROR', 'DUPLICATE_EMAIL');

    expect(mockModels.Account.create).to.have.been.callCount(0);
    expect(account).to.deep.equal(expectedResponse);
  });

  it('should include account attributes if necessary', async function () {
    mockModels.Account.create.resolves(createdAccountWithAttributes);

    const account = await createAccountFromEmailAndPassword('test@example.com', 'hashed_password', {custom_attr: '1234'});

    const expectedResponse = Utils.Functions.parseResponse('OK', createdAccountWithAttributes);

    expect(mockModels.Account.create).to.have.been.calledOnce;
    expect(account).to.deep.equal(expectedResponse);

    resetStubs();
  });
});
