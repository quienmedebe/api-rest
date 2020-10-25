const chai = require('chai');
const expect = chai.expect;

const Email = require('../../../src/services/email');

describe('Email -> templates -> recoverPassword', function () {
  it('should throw an error if there are missing fields', function () {
    const templateWithoutUrl = () => Email.templates.RecoverPassword();
    const templateWithoutConfiguration = () => Email.templates.RecoverPassword('http://example.com');
    const templateWithoutFrom = () =>
      Email.templates.RecoverPassword('http://example.com', {
        to: [],
        subject: 'Example',
        customId: '1234',
      });
    const templateWithoutTo = () =>
      Email.templates.RecoverPassword('http://example.com', {
        from: {
          email: 'example@example.com',
          name: 'From name',
        },
        subject: 'Example',
        customId: '1234',
      });
    const templateWithoutSubject = () =>
      Email.templates.RecoverPassword('http://example.com', {
        from: {
          email: 'example@example.com',
          name: 'From name',
        },
        to: [
          {
            email: 'example2@example.com',
          },
        ],
        customId: '1234',
      });
    const templateWithoutCustomId = () =>
      Email.templates.RecoverPassword('http://example.com', {
        from: {
          email: 'example@example.com',
          name: 'From name',
        },
        to: [
          {
            email: 'example2@example.com',
          },
        ],
        subject: '1234',
      });

    expect(templateWithoutUrl).to.throw();
    expect(templateWithoutConfiguration).to.throw();
    expect(templateWithoutFrom).to.throw();
    expect(templateWithoutTo).to.throw();
    expect(templateWithoutSubject).to.throw();
    expect(templateWithoutCustomId).to.throw();
  });

  it('should return the correct fields', function () {
    const response = Email.templates.RecoverPassword('http://example.com', {
      from: {
        email: 'example@example.com',
        name: 'From name',
      },
      to: [
        {
          email: 'example2@example.com',
        },
      ],
      subject: '1234',
      customId: 'RecoverPassword',
    });

    expect(response).to.have.property('from');
    expect(response).to.have.property('to');
    expect(response).to.have.property('subject');
    expect(response).to.have.property('text');
    expect(response).to.have.property('html');
    expect(response).to.have.property('customId');
  });
});
