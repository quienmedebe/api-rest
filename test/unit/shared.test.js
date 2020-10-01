const sinon = require('sinon');
const expect = require('chai').expect;
const Shared = require('../../src/modules/shared');

describe('Shared module test suite', function () {
  describe('wrapAsync test suite', function () {
    it('given a failed promise, should execute the parameter next with the error', async function () {
      const fn = sinon.stub().rejects();
      const next = sinon.stub();
      await Shared.wrapAsync(fn)(null, null, next);

      sinon.assert.called(next);
    });
  });

  describe('isString test suite', function () {
    it('should return true if the argument is a string', function () {
      const str = 'testString';

      expect(Shared.isString(str)).to.equal(true);
    });

    it('should return true if the argument is null but the strict option is false (or not passed)', function () {
      const str = null;

      expect(Shared.isString(str)).to.equal(true);
    });

    it('should return false if the argument is null and the strict option is true', function () {
      const str = null;

      expect(Shared.isString(str, {strict: true})).to.equal(false);
    });

    it('should return false if the argument is not a string', function () {
      const str = 42;

      expect(Shared.isString(str, {strict: false})).to.equal(false);
    });
  });

  describe('isNumber test suite', function () {
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
});
