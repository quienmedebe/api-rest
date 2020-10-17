const sinon = require('sinon');
const Shared = require('../../../src/modules/shared');

describe('wrapAsync test suite', function () {
  it('given a failed promise, should execute the parameter next with the error', async function () {
    const fn = sinon.stub().rejects();
    const next = sinon.stub();
    await Shared.wrapAsync(fn)(null, null, next);

    sinon.assert.called(next);
  });
});
