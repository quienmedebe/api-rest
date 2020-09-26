const sinon = require('sinon');
const Error = require('../../src/modules/error');

describe('Error module test suite', function () {
  describe('handleError test suite', function () {
    it('should invoke the log method of the logger', async function () {
      const err = {};

      const logger = {
        log: sinon.stub(),
      };

      await Error.handleError(err, {
        logger,
      });

      sinon.assert.calledOnce(logger.log);
    });

    it('should invoke the log method of the logger with the correct parameters', async function () {
      const err = {
        message: 'Error message',
        name: 'TypeError',
        stack: 'Fake stack...',
      };

      const logger = {
        log: sinon.stub(),
      };

      await Error.handleError(err, {
        logger,
      });

      sinon.assert.calledWith(logger.log, 'error', err.message, sinon.match({name: err.name, stack: err.stack}));
    });
  });
});
