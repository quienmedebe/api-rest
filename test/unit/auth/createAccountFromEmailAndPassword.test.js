const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');
const bcrypt = require('bcryptjs');
const createAccountFromEmailAndPassword = require('../../../src/modules/auth/functions/createAccountFromEmailAndPassword');
const Database = require('../../../src/database');

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe('Auth -> createAccountFromEmailAndPassword', function () {
  it('should throw an error if the email or the password are not valid', function () {
    const resultWrongEmail = createAccountFromEmailAndPassword(34, '123456');
    const resultWrongPassword = createAccountFromEmailAndPassword('test@example.com', '');

    expect(resultWrongEmail).to.be.rejectedWith(Error);
    expect(resultWrongPassword).to.be.rejectedWith(Error);
  });

  it('should call the database to get a response', async function () {
    const databaseStub = sinon.stub(Database.functions.auth, 'createAccountFromEmailAndPassword').resolves({id: 3});
    const bcryptStub = sinon.stub(bcrypt, 'hash').resolves('hashed_password');

    const response = await createAccountFromEmailAndPassword('test@example.com', '123456');

    expect(databaseStub, 'Database function not called').to.have.been.calledOnce;
    expect(response, 'Should return the record').not.to.be.undefined;

    databaseStub.restore();
    bcryptStub.restore();
  });
});
