const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;
const sinonChai = require('sinon-chai');
const chaiArrays = require('chai-arrays');
const Database = require('../../../../src/database');
const Utils = require('../../../utils');

chai.use(sinonChai);
chai.use(chaiArrays);

describe('Database -> Auth -> getEmailProviderWithValidTokensFromEmail', function () {
  beforeEach(async function () {
    await Utils.scripts.truncateDB();
    sinon.stub(Date, 'now').returns(1000);
  });

  afterEach(function () {
    sinon.restore();
  });

  it('should return the email provider with the valid token', async function () {
    const provider = await Utils.factories.EmailProviderFactory();
    await Utils.factories.EmailTokenFactory({email_provider_id: provider.id, expiration_datetime: 1500, valid: true});

    const providerWithTokens = await Database.functions.auth.getEmailProviderWithValidTokensFromEmail(provider.email);

    expect(providerWithTokens).not.to.be.null;
    expect(providerWithTokens.tokens).to.be.array();
    expect(providerWithTokens.tokens).to.be.ofSize(1);
  });

  it('should return the email provider but without the invalid token', async function () {
    const provider = await Utils.factories.EmailProviderFactory();
    await Utils.factories.EmailTokenFactory({email_provider_id: provider.id, expiration_datetime: 1500, valid: false});

    const providerWithTokens = await Database.functions.auth.getEmailProviderWithValidTokensFromEmail(provider.email);

    expect(providerWithTokens).not.to.be.null;
    expect(providerWithTokens.tokens).to.be.array();
    expect(providerWithTokens.tokens).to.be.ofSize(0);
  });

  it('should return the email provider but without the expired token', async function () {
    const provider = await Utils.factories.EmailProviderFactory();
    await Utils.factories.EmailTokenFactory({email_provider_id: provider.id, expiration_datetime: 900, valid: true});

    const providerWithTokens = await Database.functions.auth.getEmailProviderWithValidTokensFromEmail(provider.email);

    expect(providerWithTokens).not.to.be.null;
    expect(providerWithTokens.tokens).to.be.array();
    expect(providerWithTokens.tokens).to.be.ofSize(0);
  });

  it('should return null if the provider does not exist', async function () {
    const providerWithTokens = await Database.functions.auth.getEmailProviderWithValidTokensFromEmail('test@example.com');

    expect(providerWithTokens).to.be.null;
  });
});
