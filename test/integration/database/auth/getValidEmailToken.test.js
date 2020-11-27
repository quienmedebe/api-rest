const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
const Database = require('../../../../src/database');

chai.use(chaiAsPromised);

describe('Database -> Auth -> getValidEmailToken', function () {
  it('should return a rejected promise if no parameters are passed', async function () {
    const response = Database.functions.auth.getValidEmailToken();

    expect(response).to.be.rejectedWith(Error);
  });
});
