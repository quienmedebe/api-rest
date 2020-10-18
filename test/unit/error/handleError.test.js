const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);

const Errors = require('../../../src/modules/error');

describe('handleError test suite', function () {
  it('should call the logger', async function () {
    const consoleStub = sinon.stub(console, 'log').callsFake();
    const logger = {
      log: sinon.stub(),
    };

    await Errors.handleError(new Error('Some error happened'), {logger});

    expect(logger.log).to.have.been.calledOnce;
    consoleStub.restore();
  });
});
