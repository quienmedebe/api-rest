const chai = require('chai');
const expect = chai.expect;

const Email = require('../../../src/services/email');

describe('Email -> client', function () {
  it('should return the strategy used', function () {
    const initialStrategy = {
      methodExample: () => {},
    };
    const initialClient = Email(initialStrategy);

    expect(initialClient).to.have.property('methodExample');
  });

  it('should change the strategy', function () {
    const initialStrategy = {
      methodOne: () => {},
    };

    const nextStrategy = {
      methodTwo: () => {},
    };

    const initialClient = Email(initialStrategy);

    Email.useStrategy(nextStrategy);
    const nextClient = Email.getClient();

    expect(initialClient).to.have.property('methodOne');
    expect(nextClient).to.have.property('methodTwo');
  });

  it('should select the default strategy when the name does not match', function () {
    const strategyName = Email.getStrategyByName('default');

    expect(strategyName).to.be.an('object');
  });
});
