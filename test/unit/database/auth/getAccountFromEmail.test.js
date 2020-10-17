const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');
const proxyquire = require('proxyquire');
const {makeMockModels} = require('sequelize-test-helpers');
const Utils = require('../../../utils');

chai.use(sinonChai);
chai.use(chaiAsPromised);

const savedAccount = {
  id: 1,
  created_at: new Date(Date.now()).toISOString(),
  updated_at: new Date(Date.now()).toISOString(),
  deleted_at: null,
};

const mockModels = makeMockModels({
  Account: {
    findOne: sinon.stub(({include}) => Promise.resolve(include[0].where.email === 'account@example.com' ? savedAccount : null)),
  },
});

const getAccountFromEmail = proxyquire('../../../../src/database/functions/auth/getAccountFromEmail.js', {
  '../../models': mockModels,
});

describe('getAccountFromEmail', function () {
  it('should return a success response with the account if it exists', async function () {
    const account = await getAccountFromEmail('account@example.com');

    const expectedResponse = Utils.Functions.parseResponse('OK', savedAccount);

    expect(account).to.deep.equal(expectedResponse);
  });

  it('should return an error response if the account does not exist', async function () {
    const account = await getAccountFromEmail('doesnotexist@example.com');

    const expectedResponse = Utils.Functions.parseResponse('ERROR', 'ACCOUNT_NOT_FOUND');

    expect(account).to.deep.equal(expectedResponse);
  });

  it('should throw an error if the email is not a string', async function () {
    const result = getAccountFromEmail(4);
    expect(result).to.be.rejectedWith(Error);
  });
});
