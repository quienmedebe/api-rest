const chai = require('chai');
const expect = chai.expect;
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');
const Database = require('../../../../src/database');
const Utils = require('../../../utils');

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe('Database -> Auth -> changeEmailProviderPassword', function () {
  beforeEach(async function () {
    await Utils.scripts.truncateDB();
  });

  it('should change the password on the DB', async function () {
    const provider = await Utils.factories.EmailProviderFactory({}, false);
    const previousPasswordHash = provider.password;
    const newPassword = '123456';

    const [changes] = await Database.functions.auth.changeEmailProviderPassword(+provider.id, newPassword, {salt: 4});

    await provider.reload();

    expect(provider.password, 'The password has not changed').not.to.equal(previousPasswordHash);
    expect(provider.password, 'The password must be hashed').not.to.equal(newPassword);
    expect(changes, 'Should return the number of records changed').to.equal(1);
  });

  it('should reject if the salt is not specified in the options', async function () {
    const provider = await Utils.factories.EmailProviderFactory({}, false);
    const newPassword = '123456';

    const response = Database.functions.auth.changeEmailProviderPassword(+provider.id, newPassword);

    expect(response).to.be.rejected;
  });

  it('should reject if the provider id is not a number', async function () {
    const provider = await Utils.factories.EmailProviderFactory({}, false);
    const newPassword = '123456';

    const response = Database.functions.auth.changeEmailProviderPassword(provider.id, newPassword, {salt: 4});

    expect(response).to.be.rejected;
  });
});
