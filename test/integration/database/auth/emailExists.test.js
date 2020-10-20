const chai = require('chai');
const expect = chai.expect;
const Utils = require('../../../utils');
const Database = require('../../../../src/database');

describe('Database -> emailExists', function () {
  beforeEach(async function () {
    await Utils.scripts.truncateDB();
  });

  it('should return true if the email already exists', async function () {
    const emailProvider = await Utils.factories.EmailProviderFactory();
    const response = await Database.functions.auth.emailExists(emailProvider.email);

    expect(response).to.be.true;
  });

  it('should return false if the email does not exist', async function () {
    const response = await Database.functions.auth.emailExists('unique@example.com');

    expect(response).to.be.false;
  });
});
