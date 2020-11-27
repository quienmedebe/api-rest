const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
const getAccountBalance = require('../../../src/modules/debt/functions/getAccountBalance');

chai.use(chaiAsPromised);

describe('Debt -> getAccountBalance', function () {
  it('should return a rejected promise if no account id or debt id are passed', function () {
    const invalidParameters = getAccountBalance();

    expect(invalidParameters).to.be.rejected;
  });

  it('should return a rejected promise if the account id, the debt id or both the amount and type are not defined', function () {
    const invalidAccountId = getAccountBalance({
      accountId: 'Not a valid id',
    });

    expect(invalidAccountId).to.be.rejected;
  });
});
