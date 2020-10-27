const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const chaiAsPromised = require('chai-as-promised');
const changePassword = require('../../../src/modules/auth/functions/changePassword');
const Database = require('../../../src/database');

chai.use(chaiAsPromised);

let getValidEmailTokenMock;
const tokenExample = '1'.repeat(64);

describe('Auth -> changePassword', function () {
  beforeEach(function () {
    getValidEmailTokenMock = sinon.stub(Database.functions.auth, 'getValidEmailToken');
    sinon.stub(Database.functions.auth, 'changeEmailProviderPassword').callsFake();
  });

  afterEach(function () {
    sinon.restore();
  });

  it('should throw an error if the parameters are not correct', function () {
    const invalidProviderId = changePassword('1', tokenExample, '123456', {salt: 4});
    const invalidToken = changePassword(1, null, '123456', {salt: 4});
    const invalidPassword = changePassword(1, tokenExample, null, {salt: 4});
    const invalidSalt = changePassword(1, tokenExample, '123456');

    expect(invalidProviderId).to.be.rejected;
    expect(invalidToken).to.be.rejected;
    expect(invalidPassword).to.be.rejected;
    expect(invalidSalt).to.be.rejected;
  });

  it('should return an error if there is no valid token', async function () {
    getValidEmailTokenMock.resolves(null);
    const response = await changePassword(1, tokenExample, '123456', {salt: 4});

    expect(response).to.have.property('error');
  });

  it('should change the emailToken', async function () {
    getValidEmailTokenMock.resolves({times_used: 0, valid: true, save: sinon.stub()});
    const response = await changePassword(1, tokenExample, '123456', {salt: 4});

    expect(response).to.have.property('success', true);
  });
});
