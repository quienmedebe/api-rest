const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');
const faker = require('faker');
const Database = require('../../../../src/database');
const Utils = require('../../../utils');

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe('Database -> Auth -> createOrGetWithUpdateAccountFromAppleId', function () {
  beforeEach(async function () {
    await Utils.scripts.truncateDB();
  });

  afterEach(function () {
    sinon.restore();
  });

  it('should return a rejected promise if the apple id is not a string', async function () {
    const response = Database.functions.auth.createOrGetWithUpdateAccountFromAppleId(3);

    expect(response).to.be.rejectedWith(Error);
  });

  it('should update the email of the apple provider if it is not undefined', async function () {
    const account = await Utils.factories.AccountFactory();
    const provider = await Utils.factories.AppleProviderFactory({account_id: account.id, email: faker.internet.email()}, false);
    const newEmail = faker.internet.email();
    await Database.functions.auth.createOrGetWithUpdateAccountFromAppleId(provider.id, newEmail);

    await provider.reload();

    expect(provider.email).to.equal(newEmail);
  });

  it('should not update the email of the apple provider if it is not set', async function () {
    const account = await Utils.factories.AccountFactory();
    const previousEmail = faker.internet.email();
    const provider = await Utils.factories.AppleProviderFactory({account_id: account.id, email: previousEmail}, false);
    await Database.functions.auth.createOrGetWithUpdateAccountFromAppleId(provider.id);

    await provider.reload();

    expect(provider.email).to.equal(previousEmail);
  });
});
