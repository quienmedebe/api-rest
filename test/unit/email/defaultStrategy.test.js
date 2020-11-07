const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const Email = require('../../../src/services/email');

describe('Email -> defaultStrategy', function () {
  it('should have the sendEmail function implemented', function () {
    const email = Email();

    expect(email.sendEmail).to.be.a('function');
  });

  it('should return a rejected promise the sendEmail method on the default strategy', function () {
    const email = Email();
    const result = email.sendEmail();
    expect(result).to.be.rejected;
  });
});
