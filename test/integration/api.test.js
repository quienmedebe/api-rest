const chai = require('chai');
const chaiHttp = require('chai-http');
const matchApiSchema = require('api-contract-validator').chaiPlugin;
const path = require('path');
const apiSpec = path.join(__dirname, '../../swagger.json');

const expect = chai.expect;
chai.use(chaiHttp);
chai.use(matchApiSchema({apiDefinitionsPath: apiSpec}));

const Utils = require('../utils');

describe('API test suite', function () {
  describe('API tests', function () {
    describe('/auth - Auth module', function () {
      it('should return a 200 status when a user signups with email and password when all parameters are correct', async function () {
        const doTest = await Utils.withEnvironment();

        return doTest(async requester => {
          const signupBody = {
            email: 'test@example.com',
            password: 'P4ssW0rD!',
          };
          const response = await requester.post('/auth/signup', signupBody);

          expect(response).to.have.status(200);
        });
      });

      it('should return a 400 status if the password is not provided or the email is invalid', async function () {
        const doTest = await Utils.withEnvironment();

        return doTest(async requester => {
          const wrongPasswordBody = {
            email: 'test@example.com',
            password: '',
          };
          const wrongEmailBody = {
            email: 'test@example.com',
            password: '',
          };

          const wrongPasswordResponse = await requester.post('/auth/signup', wrongPasswordBody);
          const wrongEmailResponse = await requester.post('/auth/signup', wrongEmailBody);

          expect(wrongPasswordResponse).to.have.status(400);
          expect(wrongEmailResponse).to.have.status(400);
        });
      });
    });
  });

  describe('API documentation tests', function () {
    describe('Index module', function () {
      it('GET /unauthorized', async function () {
        const doTest = await Utils.withEnvironment();

        return doTest(async requester => {
          const response = await requester.get('/unauthorized');

          expect(response).to.have.status(401).and.to.matchApiSchema();
        });
      });
    });

    describe('Auth module', function () {
      it('/signup');
    });
  });
});
