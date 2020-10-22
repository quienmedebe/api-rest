const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);

const handleError = require('../../../src/modules/errors/handleError');

describe('Errors -> handleError', function () {
  it('should call the logger', async function () {
    const consoleStub = sinon.stub(console, 'log').callsFake();
    const logger = {
      log: sinon.stub(),
    };

    await handleError(new Error('Some error happened'), {logger});

    expect(logger.log).to.have.been.calledOnce;
    consoleStub.restore();
  });
});
