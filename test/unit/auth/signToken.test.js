const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');
const jwt = require('jsonwebtoken');
const signToken = require('../../../src/modules/auth/functions/signToken');

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe('Auth -> signToken', function () {
  it('should throw an error if the id or the secret are missing', function () {
    const resultWithoutId = () => signToken({}, {}, {secret: '123'});
    const resultWithoutSecret = () => signToken({id: 4}, {}, {});

    expect(resultWithoutId).to.throw(Error);
    expect(resultWithoutSecret).to.throw(Error);
  });

  it('should call the sign token function', async function () {
    const jwtStub = sinon.stub(jwt, 'sign').returns('my_access_token');

    await signToken({id: 123}, {}, {secret: 'mysecret'});

    expect(jwtStub, 'JWT sign function not called').to.have.been.calledOnce;

    jwtStub.restore();
  });

  it('should throw an error if no arguments are passed', function () {
    const response = () => signToken();

    expect(response).to.throw(Error);
  });
});
