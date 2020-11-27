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

describe('Database -> Auth -> issueEmailToken', function () {
  beforeEach(async function () {
    await Utils.scripts.truncateDB();
    sinon.stub(Date, 'now').returns(1000);
  });

  afterEach(function () {
    sinon.restore();
  });

  it('should create the email token', async function () {
    const provider = await Utils.factories.EmailProviderFactory();
    const token = await Database.functions.auth.issueEmailToken(+provider.id, {expiresInMs: 500});

    const savedToken = await Utils.factories.EmailTokenFactory.findById(token.id);

    expect(token).not.to.be.null;
    expect(savedToken.id).to.equal(token.id);
  });

  it('should create the email token with the correct expiration time', async function () {
    const provider = await Utils.factories.EmailProviderFactory();
    const token = await Database.functions.auth.issueEmailToken(+provider.id, {expiresInMs: 500});

    const savedToken = await Utils.factories.EmailTokenFactory.findById(token.id);

    expect(+savedToken.expiration_datetime).to.equal(1500);
  });

  it('should create the email token with the valid attribute true', async function () {
    const provider = await Utils.factories.EmailProviderFactory();
    const token = await Database.functions.auth.issueEmailToken(+provider.id, {expiresInMs: 500});

    const savedToken = await Utils.factories.EmailTokenFactory.findById(token.id);

    expect(savedToken.valid).to.be.true;
  });

  it('should create the email token without expiration time if it is null', async function () {
    const provider = await Utils.factories.EmailProviderFactory();
    const token = await Database.functions.auth.issueEmailToken(+provider.id, {expiresInMs: null});

    const savedToken = await Utils.factories.EmailTokenFactory.findById(token.id);

    expect(savedToken.expiration_datetime).to.be.null;
  });

  it('should return a rejected promise if only the first parameter is set', async function () {
    const provider = await Utils.factories.EmailProviderFactory();
    const response = Database.functions.auth.issueEmailToken(+provider.id);

    expect(response).to.be.rejectedWith(Error);
  });
});
