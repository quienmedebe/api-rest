const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
const removeDebt = require('../../../src/modules/debt/functions/removeDebt');

chai.use(chaiAsPromised);

describe('Debt -> removeDebt', function () {
  it('should return a rejected promise if no parameters are passed', function () {
    const invalidParameters = removeDebt();

    expect(invalidParameters).to.be.rejected;
  });

  it('should throw an error if the account id, the debt id or both the amount and type are not defined', function () {
    const invalidAccountId = removeDebt({
      accountId: 'Not a valid id',
      debtId: 1,
    });
    const invalidDebtId = removeDebt({
      accountId: 1,
      debtId: 'Not a valid debt id',
    });

    expect(invalidAccountId).to.be.rejected;
    expect(invalidDebtId).to.be.rejected;
  });
});
