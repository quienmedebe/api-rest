const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');
const proxyquire = require('proxyquire');
const {makeMockModels} = require('sequelize-test-helpers');

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
    findOne: sinon.stub(({where}) => Promise.resolve(where.id === 1 ? savedAccount : null)),
  },
});

const getAccountFromId = proxyquire('../../../../src/database/functions/auth/getAccountFromId.js', {
  '../../models': mockModels,
});

describe('Database -> getAccountFromId', function () {
  it('should return a success response with the account if it exists', async function () {
    const account = await getAccountFromId(1);

    expect(account).to.deep.equal(savedAccount);
  });

  it('should return an error response if the account does not exist', async function () {
    const account = await getAccountFromId(2);

    expect(account).to.be.null;
  });

  it('should throw an error if the id is not a number', async function () {
    const result = getAccountFromId('abc');
    expect(result).to.be.rejectedWith(Error);
  });
});
