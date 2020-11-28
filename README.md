# Quién Me Debe API REST

[![Build Status](https://travis-ci.com/quienmedebe/api-rest.svg?branch=master)](https://travis-ci.com/quienmedebe/api-rest)
[![Coverage Status](https://coveralls.io/repos/github/quienmedebe/api-rest/badge.svg?branch=master)](https://coveralls.io/github/quienmedebe/api-rest?branch=master)

Quién Me Debe is a web application to record all personal debts. Have you ever forgot your friend owed you some money? With this app this situation will not happen again.

This repository is the API REST of the application. The intention is to keep the responsibilities isolated. With this API REST you can create your own client code and/or extend the original features.

[Base URL of the production API](https://quienmedebe.herokuapp.com/)

## Table of contents

- [Technologies](#technologies)
- [Getting started](#getting-started)
- [Test scripts](#test-scripts)
- [Documentation](#documentation)
- [Development](#development)
- [CI/CD configuration](#cicd-configuration)

## Technologies

- NodeJS
- Express
- Postgresql

## Getting started

1. Clone the repository: `git clone https://github.com/quienmedebe/api-rest.git`
2. Enter into the folder: `cd api-rest`
3. Install the dependencies: `npm install`
4. Create an `.env` file and add the environment variables. You can see an example of them on `src/config`
5. Run all migrations on the development database: `npm run dev:db:migrate`
6. Run in development mode: `npm run dev`

## Test scripts
Before running any tests, be sure to have a `.env` file with the correct `DB_URL_TEST` and the needed tables: `npm run test:db:migrate`

All tests are located inside the `test` folder. Inside, there are unit and integration tests. You can use these scripts:
- `npm run test` Run all tests. Any command line argument can be passed appending `-- --arg1`
- `npm run test:coverage` Returns a coverage report
- `npm run test:dump` Debug tool to detect resourced that has not been freed up.

## Documentation
The API uses Swagger to document itself. The documentation is regenerated after each commit inside `docs` (Markdown documentation) and `docs-html` (HTML documentation). You can also access the documentation running the application in development mode and navigating with the browser to `/docs`.

Some tests require the documentation to be up-to-date with the API. The details of the API documentation are inside the `swagger.json` file.

## Development

### Configuration
You can set environment variables inside the `.env` but if you want to use them inside the app, please use the files inside the `src/config` folder.

### Code format
The code is formatted automatically after each commit according to `.prettierrc.js` file

### Social providers
By default, Google and Apple Sign In providers are activated, so you have to provide the right credentials for the application to work.

#### Disable social providers
To disable a social provider, you will have to modify the `src/app.js` file and the `src/routes/auth/index.js`.
For example, if you want to disable the Google provider, you will have to comment or remove the next line in `src/app.js`:
```js
Auth.passport.client.use(
  Auth.passport.Strategies.GoogleStrategy({
    clientId: Config.Auth.GOOGLE_CLIENT_ID,
    clientSecret: Config.Auth.GOOGLE_CLIENT_SECRET,
    callbackUrl: Config.Auth.GOOGLE_CALLBACK_URL,
  })
);
```
and the following ones on `src/routes/auth/index.js`:
```js
Router.get('/google', passport.authenticate('google', {scope: ['openid']}));
Router.get('/google/callback', wrapAsync(GoogleLogin({logger, config})));
```
The same principle applies to Apple Sign In and every other social provider that uses oAuth 2.0.
We are thinking about making this process more developer friendly in the issue [#93](https://github.com/quienmedebe/api-rest/issues/93)

#### Get credentials for Google Sign In
You need to set three environment variables to make the application work: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`.
The easiest one of them is the `GOOGLE_CALLBACK_URL`. This is the url Google will redirect to after press the Sign In with Google link. With the default routes this value must be: `[YOUR SERVER URL]/auth/google/callback`. E.g: `http://localhost:5000/auth/google/callback`
To get the another two values, you must follow the following steps:
1. Go to the [Google Developer Console](https://console.developers.google.com/apis/dashboard)
2. Create a new project pressing the selector on the top bar.
3. Go to the Credentials tab in the left menu
4. Press the create credentials button and select OAuth Client Id.
5. Fill the form and select the newly OAuth Client Id. Your credentials are at the right: Client ID and Client secret

#### Get credentials for Apple Sign In
You can view this guide as a reference [https://github.com/ananay/apple-auth/blob/master/SETUP.md](https://github.com/ananay/apple-auth/blob/master/SETUP.md).
The environment variables you have to provide are: `APPLE_CLIENT_ID`, `APPLE_TEAM_ID`, `APPLE_KEY_ID`, `APPLE_PRIVATE_KEY_NAME`, `APPLE_CALLBACK_URL`. To set the `APPLE_CALLBACK_URL` variable, see the explanation above for the Google one. On the link above, the value you would use to configure the variable is the same value you have to provide to a specific environment value:
- `client_id` is `APPLE_CLIENT_ID`
- `team_id` is `APPLE_TEAM_ID`
- `redirect_uri` is `APPLE_CALLBACK_URL`
- `key_id` is `APPLE_KEY_ID`
The `APPLE_PRIVATE_KEY_NAME` is the name of the .p8 file you download from Apple and it should be located in `src/certificates`. E.g: `AuthKey_XXXXXXXXXX`. All .p8 files inside that folder are ignored by git.

### Emails
There are different strategies supported to send emails. You can control which one to use with the `EMAIL_STRATEGY` environment variable. The next strategies are supported: `mailjet`, `default`. The default strategy throws an error when trying to send an email.

### Logging
Each request performed against the API is logged with a unique request id.
By default, there are three transports available to use: console, Sentry and Loggly.
- The console transport is available in all environments. To active or disable it you set two different environment variables to 1 or 0: `DISABLE_CONSOLE` to disable this transport and `ACTIVE_TEST_CONSOLE` to log info on the test environment (By default in this environment the logging is silent).
The other transports are enabled only on production environments:
- Sentry: Enable or disable it with `LOGGER_USE_SENTRY`. You must set the `SENTRY_DSN` variable if this transport is active.
- Loggly: Enable or disable it with `LOGGER_USE_LOGGLY`. You must set `LOGGLY_TOKEN` and `LOGGLY_SUBDOMAIN` if the transport is enabled.

## CI\/CD configuration
After each Pull Request is created a build is triggered and the command `npm run test` is executed. If a test fails, the entire build will fail.
After each commit to master (PR merged), a build is triggered and the application is deployed to Heroku.