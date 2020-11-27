const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const matchApiSchema = require('api-contract-validator').chaiPlugin;
const path = require('path');
const randToken = require('rand-token');
const apiSpec = path.join(__dirname, '../../../swagger.json');
const {prepare, tearDown} = require('../../utils/integration');
const Utils = require('../../utils');
const googleCallbackFn = require('../../../src/modules/auth/passport/strategies/google/callbackFn');

const expect = chai.expect;
chai.use(chaiHttp);
chai.use(sinonChai);
chai.use(matchApiSchema({apiDefinitionsPath: apiSpec}));

describe('Google Sign in', function () {
  beforeEach(async function () {
    await prepare();
  });

  afterEach(function () {
    tearDown();
  });

  it('should create the Google provider and the account', async function () {
    const providerId = randToken.uid(21);
    const next = sinon.stub();

    await googleCallbackFn(null, null, {id: providerId}, next);

    const googleProvider = await Utils.factories.GoogleProviderFactory.findById(providerId);
    const account = await Utils.factories.AccountFactory.findById(googleProvider.account_id);

    expect(googleProvider).not.to.be.null;
    expect(googleProvider.id).to.equal(providerId);
    expect(googleProvider.account_id).not.to.be.null;
    expect(account).not.to.be.null;
    expect(next).to.have.been.calledWith(null, sinon.match({id: account.id}));
  });

  it('should return the current account successfully', async function () {
    const next = sinon.stub();

    const account = await Utils.factories.AccountFactory();
    const googleProvider = await Utils.factories.GoogleProviderFactory({account_id: account.id});

    await googleCallbackFn(null, null, {id: googleProvider.id}, next);

    expect(next).to.have.been.calledOnce;
    expect(next).to.have.been.calledWith(null, sinon.match({id: account.id}));
  });
});
