const chai = require('chai');
const expect = chai.expect;
const sinonChai = require('sinon-chai');
const createAccountFromEmailAndPassword = require('../../../../src/database/functions/auth/createAccountFromEmailAndPassword');
const Utils = require('../../../utils');

chai.use(sinonChai);

describe('Database -> createAccountFromEmailAndPassword', function () {
  beforeEach(async function () {
    await Utils.scripts.truncateDB();
  });

  it('should create an account from an email and a password', async function () {
    const account = await createAccountFromEmailAndPassword('test@example.com', 'hashed_password');

    expect(account).to.have.property('id');
    expect(account.email_providers[0]).to.have.property('email', 'test@example.com');
  });

  it('should return null if the user already exists', async function () {
    await Utils.factories.AccountFactory({}, false, {withEmail: {email: 'duplicatedEmail@example.com', password: 'hashed_password'}});
    const account = await createAccountFromEmailAndPassword('duplicatedEmail@example.com', 'hashed_password');

    expect(account).to.be.null;
  });
});
