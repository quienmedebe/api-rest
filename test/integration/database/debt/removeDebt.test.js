const chai = require('chai');
const expect = chai.expect;
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');
const chaiArrays = require('chai-arrays');
const Database = require('../../../../src/database');
const Utils = require('../../../utils');

chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.use(chaiArrays);

describe('Database -> Debt -> removeDebt', function () {
  beforeEach(async function () {
    await Utils.scripts.truncateDB();
  });

  it('should remove the debt', async function () {
    const account = await Utils.factories.AccountFactory();
    const originalDebt = await Utils.factories.DebtFactory({account_id: account.id, amount: 5, type: 'DEBT'});
    const response = await Database.functions.debt.removeDebt({
      accountId: account.id,
      debtId: originalDebt.public_id,
    });

    const removedDebt = await Utils.factories.DebtFactory.findByPublicId(originalDebt.public_id);

    expect(removedDebt).to.be.null;
    expect(response).to.equal(1);
  });

  it('should not remove the debt if it is from another user', async function () {
    const accountA = await Utils.factories.AccountFactory();
    const accountB = await Utils.factories.AccountFactory();
    const originalDebt = await Utils.factories.DebtFactory({account_id: accountA.id, amount: 5, type: 'DEBT'});
    const response = await Database.functions.debt.removeDebt({
      accountId: accountB.id,
      debtId: originalDebt.public_id,
    });

    const removedDebt = await Utils.factories.DebtFactory.findByPublicId(originalDebt.public_id);

    expect(removedDebt).not.to.be.null;
    expect(response).to.equal(0);
  });

  it('should not hard remove the debt', async function () {
    const account = await Utils.factories.AccountFactory();
    const originalDebt = await Utils.factories.DebtFactory({account_id: account.id, amount: 5, type: 'DEBT'});
    const response = await Database.functions.debt.removeDebt({
      accountId: account.id,
      debtId: originalDebt.public_id,
    });

    const removedDebt = await Utils.factories.DebtFactory.findByPublicIdParanoid(originalDebt.public_id);

    expect(removedDebt).not.to.be.null;
    expect(response).to.equal(1);
  });
});
