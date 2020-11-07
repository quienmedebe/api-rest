const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const Email = require('../../../src/services/email');

describe('Email -> mailjetStrategy', function () {
  it('should have the sendEmail function implemented', function () {
    const client = '123';
    const secret = '321';
    const mailjetStrategy = Email.strategies.MailJetStrategy(client, secret, {makeApiCall: false});
    const email = Email(mailjetStrategy);

    expect(email.sendEmail).to.be.a('function');
  });
});
