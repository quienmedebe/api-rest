# Quién Me Debe API REST

[![Build Status](https://travis-ci.com/quienmedebe/api-rest.svg?branch=master)](https://travis-ci.com/quienmedebe/api-rest)

Quién Me Debe is a web application to record all personal debts. Have you ever forgot your friend owed you some money? With this app this situation will not happen again.

This repository is the API REST of the application. The intention is to keep the responsibilities isolated. With this API REST you can create your own client code and/or extend the original features.

## Table of contents

- [Technologies](#technologies)
- [Getting started](#getting-started)
- [Test scripts](#test-scripts)
- [Documentation](#documentation)
- [Code format](#code-format)
- [Lint](#lint)
- [CI/CD configuration](#cicd-configuration)
- [Rate limiter](#rate-limiter)

## Technologies

- NodeJS
- Express

## Getting started

1. Clone the repository: `git clone https://github.com/quienmedebe/api-rest.git`
2. Enter into the folder: `cd api-rest`
3. Install the dependencies: `npm install`
4. Run in development mode: `npm run dev`

## Test scripts
All tests are located inside the `test` folder. Inside, there are unit and integration tests. You can use these scripts:
- `npm run test` Run all tests. Any command line argument can be passed appending `-- --arg1`
- `npm run test:watch` Watch all files and run the tests again when a file changes
- `npm run test:coverage` Returns a coverage report
- `npm run test:dump` Debug tool to detect infinite tests. It is better to solve the test root issue rather than to add the command line argument `--exit`. If the tests are not finishing it is because there is an issue there.

## Documentation
The API uses Swagger to document itself. The documentation is regenerated after each commit inside `docs` (Markdown documentation) and `docs-html` (HTML documentation). You can also access the documentation running the application in development mode and navigating with the browser to `/docs`.

Some tests require the documentation to be up-to-date with the API. The details of the API documentation are inside the `swagger.json` file.

## Code format
The code is formatted automatically after each commit according to `.prettierrc.js` file

## Lint
The code linter is ESLint.

## CI\/CD configuration
After each Pull Request is created a build is triggered and all the command `npm run test` is executed. If a test fails, the entire build will fail.
After each commit to master (PR merged), a build is triggered and the application is deployed to Heroku.

## Rate limiter
All requests must pass the root rate limiter. This limiter is fired when there are more than 10 requests per second from the same ip address. Additional rate limiters can be implemented.