const chai = require('chai');
const expect = chai.expect;
const Utils = require('../../../utils');
const Database = require('../../../../src/database');

describe('Database -> Auth -> getAccountFromId', function () {
  beforeEach(async function () {
    await Utils.scripts.truncateDB();
  });

  it('should return a success response with the account if it exists', async function () {
    const account = await Utils.factories.AccountFactory();
    const savedAccount = await Database.functions.auth.getAccountFromId(+account.id);

    expect(savedAccount).to.have.property('id', account.id);
  });

  it('should return null if the account does not exist', async function () {
    const account = await Database.functions.auth.getAccountFromId(2);

    expect(account).to.be.null;
  });

  it('should reject if the id is not a number', function () {
    const result = Database.functions.auth.getAccountFromId('abc');
    expect(result).to.be.rejectedWith(Error);
  });
});
