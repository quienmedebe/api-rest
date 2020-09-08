const express = require('express');
const cookieParser = require('cookie-parser');

const Main = require('./modules/main');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use('/', Main.router);

module.exports = app;
