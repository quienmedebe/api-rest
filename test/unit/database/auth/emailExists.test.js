const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const proxyquire = require('proxyquire');
const {makeMockModels} = require('sequelize-test-helpers');

chai.use(sinonChai);

const mockModels = makeMockModels({
  EmailProvider: {
    findOne: sinon.stub(({where}) => Promise.resolve(where.email === 'duplicated@example.com')),
  },
});

const emailExists = proxyquire('../../../../src/database/functions/auth/emailExists.js', {
  '../../models': mockModels,
});

describe('Database -> emailExists', function () {
  it('should return true if the email already exists', async function () {
    const response = await emailExists('duplicated@example.com');

    expect(response).to.be.true;
  });

  it('should return false if the email does not exist', async function () {
    const response = await emailExists('unique@example.com');

    expect(response).to.be.false;
  });
});
