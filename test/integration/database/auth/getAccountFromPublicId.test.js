const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
const Database = require('../../../../src/database');

chai.use(chaiAsPromised);

describe('Database -> Auth -> getAccountFromPublicId', function () {
  it('should return a rejected promise if the public id is not a string', async function () {
    const response = Database.functions.auth.getAccountFromPublicId(3);

    expect(response).to.be.rejectedWith(Error);
  });
});
