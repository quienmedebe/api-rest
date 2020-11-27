const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
const getDebtByPublicId = require('../../../src/modules/debt/functions/getDebtByPublicId');

chai.use(chaiAsPromised);

describe('Debt -> getDebtByPublicId', function () {
  it('should return a rejected promise if no account id is passed', function () {
    const invalidParameters = getDebtByPublicId();

    expect(invalidParameters).to.be.rejected;
  });

  it('should return a rejected promise if the account id, the debt id or both the amount and type are not defined', function () {
    const invalidAccountId = getDebtByPublicId({
      accountId: 'Not a valid id',
    });

    expect(invalidAccountId).to.be.rejected;
  });
});
