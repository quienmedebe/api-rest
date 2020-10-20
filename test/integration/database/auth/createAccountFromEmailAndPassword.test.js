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
    const email = 'test@example.com';
    const account = await createAccountFromEmailAndPassword(email, 'hashed_password');
    const provider = await Utils.factories.EmailProviderFactory.findByEmail(email);

    expect(provider).to.have.property('email', email);
    expect(provider).to.have.property('account_id', account.id);
  });

  it('should return null if the user already exists', async function () {
    const account = await Utils.factories.AccountFactory({}, false, {withEmail: true});
    const newAccount = await createAccountFromEmailAndPassword(account.email_providers[0].email, 'hashed_password');

    expect(newAccount).to.be.null;
  });
});
