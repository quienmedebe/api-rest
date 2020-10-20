const chai = require('chai');
const expect = chai.expect;
const Utils = require('../../../utils');
const Database = require('../../../../src/database');

describe('Database -> getAccountFromEmail', function () {
  beforeEach(async function () {
    await Utils.scripts.truncateDB();
  });

  it('should return a success response with the account if it exists', async function () {
    const account = await Utils.factories.AccountFactory();
    const retrievedAccount = await Database.functions.auth.getAccountFromEmail(account.email_providers[0].email);
    const savedAccount = await Utils.factories.AccountFactory.findById(account.id);

    expect(savedAccount).not.to.be.null;
    expect(retrievedAccount).to.have.property('id', account.id);
  });

  it('should return null if the account does not exist', async function () {
    const account = await Database.functions.auth.getAccountFromEmail('doesnotexist@example.com');

    expect(account).to.be.null;
  });

  it('should reject if the email is not a string', function () {
    const result = Database.functions.auth.getAccountFromEmail(4);
    expect(result).to.be.rejectedWith(Error);
  });
});
