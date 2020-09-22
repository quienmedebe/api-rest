# Quién Me Debe API REST

[![Build Status](https://travis-ci.com/quienmedebe/api-rest.svg?branch=master)](https://travis-ci.com/quienmedebe/api-rest)

Quién Me Debe is a web application to record all personal debts. Have you ever forgot your friend owed you some money? With this app this situation will not happen again.

This repository is the API REST of the application. The intention is to keep the responsibilities isolated. With this API REST you can create your own client code and/or extend the original features.

## Table of contents

- [Technologies](#technologies)
- [Getting started](#getting-started)
- [Documentation](#documentation)
- [Features](#features)

## Technologies

- NodeJS
- Express

## Getting started

1. Clone the repository: `git clone https://github.com/quienmedebe/api-rest.git`
2. Enter into the folder: `cd api-rest`
3. Install the dependencies: `npm install`
4. Run in production mode: `npm start`

## Documentation

To generate the documentation:

1. Clone the repository `git clone https://github.com/quienmedebe/api-rest.git`
2. Enter into the repository folder `cd api-rest`
3. Generate the documentation `npm run docs`. The documentation will appear inside the docs folder.
4. With your browser open the `docs/index.html` file.

Inside the documentation you will find the public API routes and different module documentation.

## Features

### Developed

- API Rate Limiter

### To do

- Basic Walking Skeleton (CI/CD, Build process, Rate limiter...)
- CI/CD flow
- Release flow
- Dockerization
- Development environment with Docker
- Deploy to production process
- Authentication system with JWT
- CRUD of debts (Create debts, Read debts, Update debts, Delete Debts).
