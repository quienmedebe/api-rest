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

describe('Database -> Debt -> editDebt', function () {
  beforeEach(async function () {
    await Utils.scripts.truncateDB();
  });

  it('should edit the debt', async function () {
    const account = await Utils.factories.AccountFactory();
    const originalDebt = await Utils.factories.DebtFactory({account_id: account.id, amount: 5, type: 'DEBT'});
    const response = await Database.functions.debt.editDebt({
      accountId: account.id,
      debtId: originalDebt.public_id,
      amount: 10,
      type: 'CREDIT',
    });

    const editedDebt = await Utils.factories.DebtFactory.findByPublicId(originalDebt.public_id);

    expect(+editedDebt.amount).to.equal(10);
    expect(editedDebt.type).to.equal('CREDIT');
    expect(response).to.be.ofSize(1);
    expect(response[0]).to.equal(1);
  });

  it('should not edit the debt if it is from another user', async function () {
    const accountA = await Utils.factories.AccountFactory();
    const accountB = await Utils.factories.AccountFactory();
    const originalDebt = await Utils.factories.DebtFactory({account_id: accountA.id, amount: 5, type: 'DEBT'});
    const response = await Database.functions.debt.editDebt({
      accountId: accountB.id,
      debtId: originalDebt.public_id,
      amount: 10,
      type: 'CREDIT',
    });

    const editedDebt = await Utils.factories.DebtFactory.findByPublicId(originalDebt.public_id);

    expect(+editedDebt.amount).to.equal(5);
    expect(editedDebt.type).to.equal('DEBT');
    expect(response).to.be.ofSize(1);
    expect(response[0]).to.equal(0);
  });

  it('should edit only the amount if the type is undefined', async function () {
    const account = await Utils.factories.AccountFactory();
    const originalDebt = await Utils.factories.DebtFactory({account_id: account.id, amount: 5, type: 'DEBT'});
    const response = await Database.functions.debt.editDebt({
      accountId: account.id,
      debtId: originalDebt.public_id,
      amount: 10,
    });

    const editedDebt = await Utils.factories.DebtFactory.findByPublicId(originalDebt.public_id);

    expect(+editedDebt.amount).to.equal(10);
    expect(editedDebt.type).to.equal('DEBT');
    expect(response).to.be.ofSize(1);
    expect(response[0]).to.equal(1);
  });

  it('should edit only the type if the amount is undefined', async function () {
    const account = await Utils.factories.AccountFactory();
    const originalDebt = await Utils.factories.DebtFactory({account_id: account.id, amount: 5, type: 'DEBT'});
    const response = await Database.functions.debt.editDebt({
      accountId: account.id,
      debtId: originalDebt.public_id,
      type: 'CREDIT',
    });

    const editedDebt = await Utils.factories.DebtFactory.findByPublicId(originalDebt.public_id);

    expect(+editedDebt.amount).to.equal(5);
    expect(editedDebt.type).to.equal('CREDIT');
    expect(response).to.be.ofSize(1);
    expect(response[0]).to.equal(1);
  });
});
