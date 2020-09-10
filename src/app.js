const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

const Main = require('./modules/main');

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use('/', Main.router);

module.exports = app;
