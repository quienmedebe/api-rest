const chai = require('chai');
const expect = chai.expect;
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');
const Database = require('../../../../src/database');
const Utils = require('../../../utils');

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe('Database -> Debt -> createDebt', function () {
  beforeEach(async function () {
    await Utils.scripts.truncateDB();
  });

  it('should create a debt', async function () {
    const account = await Utils.factories.AccountFactory();
    const debt = await Database.functions.debt.createDebt({
      accountId: account.id,
      amount: 10,
      type: 'CREDIT',
    });

    const createdDebt = await Utils.factories.DebtFactory.findByPublicId(debt.public_id);

    expect(createdDebt).not.to.be.null;
    expect(+createdDebt.amount).to.equal(10);
    expect(createdDebt.type).to.equal('CREDIT');
  });
});
