const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const nodeMailjet = require('node-mailjet');
const Email = require('../../../../src/services/email');

chai.use(sinonChai);

describe.skip('Email -> Mailjet -> sendEmail', function () {
  beforeEach(function () {
    sinon.stub(nodeMailjet, 'connect').returns(nodeMailjet);
  });

  afterEach(function () {
    sinon.restore();
  });

  it('should return a successful response', async function () {
    const mailjetStrategy = Email.getStrategyByName('mailjet', {MAILJET_CLIENT_ID: '1234', MAILJET_SECRET: '1234'}, {makeApiCall: false});
    Email.useStrategy(mailjetStrategy);
    const emailService = Email.getClient();

    const emailContent = {
      to: [
        {
          email: 'contacto@quienmedebe.com',
        },
      ],
      from: [
        {
          email: 'example@quienmedebe.com',
          name: 'Quien Me Debe',
        },
      ],
      subject: 'Email example',
      text: 'This is an example email',
      html: 'This is an example email on html',
      customId: 'test',
    };

    const response = await emailService.sendEmail(emailContent);
    console.log(response);
    expect(response).to.equal(1);
  });
});
