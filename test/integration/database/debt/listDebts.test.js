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

describe('Database -> Debt -> listDebts', function () {
  beforeEach(async function () {
    await Utils.scripts.truncateDB();
  });

  it('should return one debt', async function () {
    const account = await Utils.factories.AccountFactory();
    await Utils.factories.DebtFactory({account_id: account.id, amount: 5, type: 'DEBT'});
    const response = await Database.functions.debt.listDebts({
      accountId: account.id,
      page: 1,
      pageSize: 25,
    });

    expect(response.rows).to.be.ofSize(1);
    expect(response.count).to.equal(1);
  });

  it('should not return any debt', async function () {
    const account = await Utils.factories.AccountFactory();
    const response = await Database.functions.debt.listDebts({
      accountId: account.id,
      page: 1,
      pageSize: 25,
    });

    expect(response.rows).to.be.ofSize(0);
    expect(response.count).to.equal(0);
  });

  it('should return only one debt if the page size is one and there are two debts', async function () {
    const account = await Utils.factories.AccountFactory();
    await Utils.factories.DebtFactory({account_id: account.id, amount: 5, type: 'DEBT'});
    await Utils.factories.DebtFactory({account_id: account.id, amount: 5, type: 'DEBT'});
    const response = await Database.functions.debt.listDebts({
      accountId: account.id,
      page: 1,
      pageSize: 1,
    });

    expect(response.rows).to.be.ofSize(1);
    expect(response.count).to.equal(2);
  });

  it('should not return any debts if there is one debt but it is searching on the second page', async function () {
    const account = await Utils.factories.AccountFactory();
    await Utils.factories.DebtFactory({account_id: account.id, amount: 5, type: 'DEBT'});
    const response = await Database.functions.debt.listDebts({
      accountId: account.id,
      page: 2,
      pageSize: 1,
    });

    expect(response.rows).to.be.ofSize(0);
    expect(response.count).to.equal(1);
  });

  it('should return a rejected promise if no parameters are passed', async function () {
    const response = Database.functions.debt.listDebts();

    expect(response).to.be.rejectedWith(Error);
  });

  it('should be able to add or override options using the config parameter', async function () {
    const account = await Utils.factories.AccountFactory();
    await Utils.factories.DebtFactory({account_id: account.id, amount: 5, type: 'DEBT'});
    await Utils.factories.DebtFactory({account_id: account.id, amount: 1, type: 'CREDIT'});

    const response = await Database.functions.debt.listDebts(
      {
        accountId: account.id,
        page: 1,
        pageSize: 2,
      },
      {
        limit: 1,
      }
    );

    expect(response.rows).to.be.ofSize(1);
  });

  it('should return default values for page and page size if they are not provided', async function () {
    const account = await Utils.factories.AccountFactory();
    await Utils.factories.DebtFactory({account_id: account.id, amount: 5, type: 'DEBT'});
    await Utils.factories.DebtFactory({account_id: account.id, amount: 1, type: 'CREDIT'});

    const response = await Database.functions.debt.listDebts({
      accountId: account.id,
    });

    expect(response.rows).to.be.ofSize(2);
  });
});
