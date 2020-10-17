const expect = require('chai').expect;
const Shared = require('../../../src/modules/shared');

describe('sendResponse test suite', function () {
  it('should return an object with a status and value property', function () {
    const response = Shared.sendResponse('ERROR', 'MY_ERROR_CODE');

    const expectedResponse = {
      status: 'ERROR',
      value: 'MY_ERROR_CODE',
    };
    expect(response).to.deep.equal(expectedResponse);
  });

  it('should return the success response payload in the value property', function () {
    const payloadExample = {
      id: 34,
    };
    const response = Shared.sendResponse('OK', payloadExample);

    const expectedResponse = {
      status: 'OK',
      value: payloadExample,
    };
    expect(response).to.deep.equal(expectedResponse);
  });

  it('should allow to add metadata to the response', function () {
    const response = Shared.sendResponse('ERROR', 'MY_ERROR_CODE', {message: 'My message'});

    const expectedResponse = {
      status: 'ERROR',
      value: 'MY_ERROR_CODE',
      message: 'My message',
    };

    expect(response).to.deep.equal(expectedResponse);
  });

  it('should never overwrite the status or value properties', function () {
    const response = Shared.sendResponse('ERROR', 'MY_ERROR_CODE', {status: 'OK', value: 'All OK'});

    const expectedResponse = {
      status: 'ERROR',
      value: 'MY_ERROR_CODE',
    };

    expect(response).to.deep.equal(expectedResponse);
  });

  it('should have OK property', function () {
    expect(Shared.sendResponse.OK).to.equal('OK');
  });

  it('should have ERROR property', function () {
    expect(Shared.sendResponse.ERROR).to.equal('ERROR');
  });

  it('should have an isError function which returns true if the response is an error', function () {
    const response = Shared.sendResponse('ERROR', 'ERROR_CODE');
    expect(Shared.sendResponse.isError(response)).to.be.true;
  });

  it('should have an isError function which returns false if the response is not an error', function () {
    const response = Shared.sendResponse('OK', 'ERROR_CODE');
    expect(Shared.sendResponse.isError(response)).to.be.false;
  });
});
