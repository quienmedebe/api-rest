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
      describe('/signup', function () {
        it('should return a 200 status when a user signups with email and password when all parameters are correct @api @auth @signup @slow', async function () {
          const doTest = await Utils.withEnvironment();

          return doTest(async requester => {
            const signupBody = {
              email: 'test@example.com',
              password: 'P4ssW0rD!',
            };
            const response = await requester.post('/auth/signup').send(signupBody);

            expect(response, 'Wrong status code').to.have.status(200);
            expect(response.body, 'access_token property not found').to.have.property('access_token');

            expect(response).to.matchApiSchema();
          });
        });

        it('should return a 400 status if the password or the email are invalid @api @auth @signup @slow', async function () {
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
            const notMinimumPasswordLength = {
              email: 'test@example.com',
              password: '12345',
            };
            const notMaximumPasswordLength = {
              email: 'test@example.com',
              password: '1'.repeat(256),
            };

            const wrongPasswordResponse = await requester.post('/auth/signup').send(wrongPasswordBody);
            const wrongEmailResponse = await requester.post('/auth/signup').send(wrongEmailBody);
            const wrongPasswordMinimumLengthResponse = await requester.post('/auth/signup').send(notMinimumPasswordLength);
            const wrongPasswordMaximumLengthResponse = await requester.post('/auth/signup').send(notMaximumPasswordLength);

            expect(wrongPasswordResponse, 'The wrong password response status is not correct').to.have.status(400);
            expect(wrongPasswordResponse.body, 'Should have an error property (wrong password response)').to.have.property('error');

            expect(wrongEmailResponse, 'The wrong email response status is not correct').to.have.status(400);
            expect(wrongEmailResponse.body, 'Should have an error property (wrong email response)').to.have.property('error');

            expect(wrongPasswordMinimumLengthResponse, 'The password length below minimum required status is not correct').to.have.status(400);
            expect(wrongPasswordMinimumLengthResponse.body, 'Should have an error property (password length below minimum required)').to.have.property('error');

            expect(wrongPasswordMaximumLengthResponse, 'The password length above maximum length status is not correct').to.have.status(400);
            expect(wrongPasswordMaximumLengthResponse.body, 'Should have an error property (password length above maximum length)').to.have.property('error');

            expect(wrongPasswordResponse).to.matchApiSchema();
          });
        });

        describe('/login', function () {
          it('should return 200 and return the access_token if the user authenticates successfully @api @auth @login @slow', async function () {
            const doTest = await Utils.withEnvironment();

            return doTest(async requester => {
              const body = {
                email: 'test@example.com',
                password: '123456',
              };

              await requester.post('/auth/signup').send(body);
              const loginResponse = await requester.post('/auth/login').send(body);

              expect(loginResponse, 'The status code is incorrect').to.have.status(200);
              expect(loginResponse.body, 'access_token not found on body response').to.have.property('access_token');

              expect(loginResponse).to.matchApiSchema();
            });
          });

          it('should return 401 if the user does not exist on the database', async function () {
            const doTest = await Utils.withEnvironment();

            return doTest(async requester => {
              const body = {
                email: 'test@example.com',
                password: '123456',
              };

              const loginResponse = await requester.post('/auth/login').send(body);

              expect(loginResponse).to.have.status(401);

              expect(loginResponse).to.matchApiSchema();
            });
          });
        });
      });
    });
  });
});
