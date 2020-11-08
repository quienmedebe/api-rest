const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
const listDebts = require('../../../src/modules/debt/functions/listDebts');

chai.use(chaiAsPromised);

describe('Debt -> listDebts', function () {
  it('should throw an error if the account id, the debt id or both the amount and type are not defined', function () {
    const invalidAccountId = listDebts({
      accountId: 'Not a valid id',
      page: 1,
      pageSize: 25,
    });
    const invalidPage = listDebts({
      accountId: 1,
      page: 0,
      pageSize: 25,
    });
    const invalidPageSize = listDebts({
      accountId: 1,
      page: 1,
      pageSize: 0,
    });

    expect(invalidAccountId).to.be.rejected;
    expect(invalidPage).to.be.rejected;
    expect(invalidPageSize).to.be.rejected;
  });
});
