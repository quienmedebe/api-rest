const chai = require('chai');
const expect = chai.expect;
const Utils = require('../../../utils');
const emailExists = require('../../../../src/database/functions/auth/emailExists');

describe('Database -> emailExists', function () {
  beforeEach(async function () {
    await Utils.scripts.truncateDB();
  });

  it('should return true if the email already exists', async function () {
    const emailProvider = await Utils.factories.EmailProviderFactory();
    const response = await emailExists(emailProvider.email);

    expect(response).to.be.true;
  });

  it('should return false if the email does not exist', async function () {
    const response = await emailExists('unique@example.com');

    expect(response).to.be.false;
  });
});
