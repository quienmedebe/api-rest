const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const chaiAsPromised = require('chai-as-promised');
const createEmailToken = require('../../../src/modules/auth/functions/createEmailToken');
const Database = require('../../../src/database');

chai.use(chaiAsPromised);

let issueEmailTokenMock;

describe('Auth -> createEmailToken', function () {
  beforeEach(function () {
    issueEmailTokenMock = sinon.stub(Database.functions.auth, 'issueEmailToken');
  });

  afterEach(function () {
    sinon.restore();
  });

  it('should throw an error if the parameters are not correct', function () {
    const invalidEmailProviderId = createEmailToken('1', {expiresInMs: 400});
    const invalidExpiration = createEmailToken(1, {expiresInMs: '400'});

    expect(invalidEmailProviderId).to.be.rejected;
    expect(invalidExpiration).to.be.rejected;
  });

  it('should return the issued token', async function () {
    issueEmailTokenMock.resolves({token: true});

    const response = await createEmailToken(1, {expiresInMs: 400});

    expect(response).to.have.property('token', true);
  });
});
