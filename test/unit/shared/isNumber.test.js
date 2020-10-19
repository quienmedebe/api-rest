const expect = require('chai').expect;
const Shared = require('../../../src/modules/shared');

describe('Shared -> isNumber', function () {
  it('should return true if the argument is a number', function () {
    const num = 42;

    expect(Shared.isNumber(num)).to.be.true;
  });

  it('should return false if the argument is Infinity', function () {
    const num = Infinity;

    expect(Shared.isNumber(num)).to.be.false;
  });

  it('should return false if the argument is NaN', function () {
    const num = NaN;

    expect(Shared.isNumber(num)).to.be.false;
  });

  it('should return false if the number is not defined', function () {
    expect(Shared.isNumber()).to.be.false;
  });

  it('should return false if the number is null', function () {
    expect(Shared.isNumber(null)).to.be.false;
  });

  it('should return true if the number is not defined and the strict option is inactive', function () {
    expect(Shared.isNumber(undefined, {strict: false})).to.be.true;
  });

  it('should return true if the number is null and the strict option is inactive', function () {
    expect(Shared.isNumber(null, {strict: false})).to.be.true;
  });

  it('should return false if a string is passed', function () {
    expect(Shared.isNumber('1')).to.be.false;
  });

  it('should return false if a string which cannot be coerced to a number is passed', function () {
    expect(Shared.isNumber('Not a number')).to.be.false;
  });

  it('should return false if an object is passed', function () {
    expect(Shared.isNumber({})).to.be.false;
  });
});
