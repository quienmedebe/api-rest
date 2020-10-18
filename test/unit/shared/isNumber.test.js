const expect = require('chai').expect;
const Shared = require('../../../src/modules/shared');

describe('Shared -> isNumber', function () {
  it('should return true if the argument is a number', function () {
    const num = 42;

    expect(Shared.isNumber(num)).to.equal(true);
  });

  it('should return false if the argument is Infinity', function () {
    const num = Infinity;

    expect(Shared.isNumber(num)).to.equal(false);
  });

  it('should return false if the argument is NaN', function () {
    const num = NaN;

    expect(Shared.isNumber(num)).to.equal(false);
  });
});
