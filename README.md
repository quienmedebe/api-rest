# Quién Me Debe API REST

[![Build Status](https://travis-ci.com/quienmedebe/api-rest.svg?branch=master)](https://travis-ci.com/quienmedebe/api-rest)
[![Coverage Status](https://coveralls.io/repos/github/quienmedebe/api-rest/badge.svg?branch=master)](https://coveralls.io/github/quienmedebe/api-rest?branch=master)

Quién Me Debe is a web application to record all personal debts. Have you ever forgot your friend owed you some money? With this app this situation will not happen again.

This repository is the API REST of the application. The intention is to keep the responsibilities isolated. With this API REST you can create your own client code and/or extend the original features.

[Click here to access to the API](https://quienmedebe.herokuapp.com/)

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

### Code format
The code is formatted automatically after each commit according to `.prettierrc.js` file

### Lint
The code linter is ESLint and its rules are in the `.eslintrc.js` file

### Configuration
You can set environment variables inside the `.env` but if you want to use them inside the app, please use the files inside the `src/config` folder.

### Emails
There are different strategies supported to send emails. You can control which one to use with the `EMAIL_STRATEGY` environment variable. The next strategies are supported: `mailjet`, `default`. The default strategy throws an error when trying to send an email.

## CI\/CD configuration
After each Pull Request is created a build is triggered and the command `npm run test` is executed. If a test fails, the entire build will fail.
After each commit to master (PR merged), a build is triggered and the application is deployed to Heroku.