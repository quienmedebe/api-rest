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
    describe('/auth - Auth module @slow', function () {
      it('should return a 200 status when a user signups with email and password when all parameters are correct', async function () {
        const doTest = await Utils.withEnvironment();

        return doTest(async requester => {
          const signupBody = {
            email: 'test@example.com',
            password: 'P4ssW0rD!',
          };
          const response = await requester.post('/auth/signup').send(signupBody);

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
            email: 'test@',
            password: '123456',
          };

          const wrongPasswordResponse = await requester.post('/auth/signup').send(wrongPasswordBody);
          const wrongEmailResponse = await requester.post('/auth/signup').send(wrongEmailBody);

          expect(wrongPasswordResponse).to.have.status(400);
          expect(wrongEmailResponse).to.have.status(400);
        });
      });

      it('should return a 400 status if the password length is below the minimum required', async function () {
        const doTest = await Utils.withEnvironment();

        return doTest(async requester => {
          const signupBody = {
            email: 'test@example.com',
            password: '12345',
          };

          const wrongPasswordResponse = await requester.post('/auth/signup').send(signupBody);

          expect(wrongPasswordResponse).to.have.status(400);
        });
      });

      it('should return a 400 status if the password length is above the maximum limit', async function () {
        const doTest = await Utils.withEnvironment();

        return doTest(async requester => {
          const signupBody = {
            email: 'test@example.com',
            password: '1'.repeat(256),
          };

          const wrongPasswordResponse = await requester.post('/auth/signup').send(signupBody);

          expect(wrongPasswordResponse).to.have.status(400);
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
