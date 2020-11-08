const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);

const handleError = require('../../../src/modules/errors/handleError');

describe('Errors -> handleError', function () {
  it('should call the logger', async function () {
    const consoleStub = sinon.stub(console, 'error').callsFake();
    const logger = {
      error: sinon.stub(),
    };

    await handleError(new Error('Some error happened'), {logger});

    expect(logger.error).to.have.been.calledOnce;
    consoleStub.restore();
  });
});
