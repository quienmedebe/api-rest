const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const matchApiSchema = require('api-contract-validator').chaiPlugin;
const path = require('path');
const randToken = require('rand-token');
const faker = require('faker');
const apiSpec = path.join(__dirname, '../../../swagger.json');
const {prepare, tearDown} = require('../../utils/integration');
const Utils = require('../../utils');
const appleCallbackFn = require('../../../src/modules/auth/passport/strategies/apple/callbackFn');

const expect = chai.expect;
chai.use(chaiHttp);
chai.use(sinonChai);
chai.use(matchApiSchema({apiDefinitionsPath: apiSpec}));

describe('Apple Sign in', function () {
  beforeEach(async function () {
    await prepare();
  });

  afterEach(function () {
    tearDown();
  });

  it('should create the Apple provider and the account', async function () {
    const providerId = randToken.uid(21);
    const providerEmail = faker.internet.email();
    const next = sinon.stub();

    await appleCallbackFn(null, null, {sub: providerId, email: providerEmail}, null, next);

    const appleProvider = await Utils.factories.AppleProviderFactory.findById(providerId);
    const account = await Utils.factories.AccountFactory.findById(appleProvider.account_id);

    expect(appleProvider).not.to.be.null;
    expect(appleProvider.id).to.equal(providerId);
    expect(appleProvider.email).to.equal(providerEmail);
    expect(appleProvider.account_id).not.to.be.null;
    expect(account).not.to.be.null;
    expect(next).to.have.been.calledWith(null, sinon.match({id: account.id}));
  });

  it('should return the current account successfully', async function () {
    const next = sinon.stub();

    const account = await Utils.factories.AccountFactory();
    const appleProvider = await Utils.factories.AppleProviderFactory({account_id: account.id});

    await appleCallbackFn(null, null, {sub: appleProvider.id, email: appleProvider.email}, null, next);

    expect(next).to.have.been.calledOnce;
    expect(next).to.have.been.calledWith(null, sinon.match({id: account.id}));
  });

  it('should update the apple provider email if a new one is provided', async function () {
    const next = sinon.stub();
    const newEmail = faker.internet.email();

    const account = await Utils.factories.AccountFactory();
    const appleProvider = await Utils.factories.AppleProviderFactory({account_id: account.id}, false);

    await appleCallbackFn(null, null, {sub: appleProvider.id, email: newEmail}, null, next);

    await appleProvider.reload();

    expect(appleProvider.email).to.equal(newEmail);
    expect(next).to.have.been.calledOnce;
    expect(next).to.have.been.calledWith(null, sinon.match({id: account.id}));
  });
});
