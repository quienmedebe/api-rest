const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
const addDebt = require('../../../src/modules/debt/functions/addDebt');

chai.use(chaiAsPromised);

describe('Debt -> addDebt', function () {
  it('should throw an error if the parameters are not correct', function () {
    const invalidAccountId = addDebt({
      accountId: 'Not a valid id',
      amount: 15,
      type: 'DEBT',
    });
    const invalidAmount = addDebt({
      accountId: 1,
      amount: 'Not a valid amount',
      type: 'DEBT',
    });
    const invalidType = addDebt({
      accountId: 1,
      amount: 15,
      type: 'Not a valid type',
    });

    expect(invalidAccountId).to.be.rejected;
    expect(invalidAmount).to.be.rejected;
    expect(invalidType).to.be.rejected;
  });
});
