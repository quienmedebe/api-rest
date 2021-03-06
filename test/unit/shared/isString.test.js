const expect = require('chai').expect;
const isString = require('../../../src/modules/shared/isString');

describe('Shared -> isString', function () {
  it('should return true if the argument is a string', function () {
    const str = 'testString';

    expect(isString(str)).to.equal(true);
  });

  it('should return true if the argument is null but the strict option is false (or not passed)', function () {
    const str = null;

    expect(isString(str)).to.equal(true);
  });

  it('should return false if the argument is null and the strict option is true', function () {
    const str = null;

    expect(isString(str, {strict: true})).to.equal(false);
  });

  it('should return false if the argument is not a string', function () {
    const str = 42;

    expect(isString(str, {strict: false})).to.equal(false);
  });
});
