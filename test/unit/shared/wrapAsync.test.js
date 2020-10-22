const sinon = require('sinon');
const wrapAsync = require('../../../src/modules/shared/wrapAsync');

describe('Shared -> wrapAsync', function () {
  it('given a failed promise, should execute the parameter next with the error', async function () {
    const fn = sinon.stub().rejects();
    const next = sinon.stub();
    await wrapAsync(fn)(null, null, next);

    sinon.assert.called(next);
  });
});
