const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
const editDebt = require('../../../src/modules/debt/functions/editDebt');

chai.use(chaiAsPromised);

describe('Debt -> editDebt', function () {
  it('should throw an error if the account id, the debt id or both the amount and type are not defined', function () {
    const invalidAccountId = editDebt({
      accountId: 'Not a valid id',
      debtId: 1,
      amount: 15,
      type: 'DEBT',
    });
    const invalidDebtId = editDebt({
      accountId: 1,
      debtId: 'Not a valid debt id',
      amount: 1,
      type: 'DEBT',
    });
    const invalidAttributes = editDebt({
      accountId: 1,
      debtId: 1,
    });

    expect(invalidAccountId).to.be.rejected;
    expect(invalidDebtId).to.be.rejected;
    expect(invalidAttributes).to.be.rejected;
  });
});
