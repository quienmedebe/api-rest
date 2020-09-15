const express = require('express');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const helmet = require('helmet');
const redis = require('redis');
const cors = require('cors');

const Config = require('./config');
const Env = require('./env');
const Errors = require('./modules/error');
const Middlewares = require('./middlewares');

const Main = require('./modules/main');
const Logger = require('./modules/logger');

const app = express();

app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser(Env.COOKIES_SESSION_SECRET));
app.use(cors());

app.use(Middlewares.HttpContext.httpContext.middleware);
app.use(Middlewares.HttpContext.requestIdMiddleware);

const logger = Logger.createHttpLogger(Middlewares.HttpContext.httpContext);

const redisClient = redis.createClient();

app.use(
  Middlewares.RateLimiter.RequestLimitBySecond({
    redis: redisClient,
    errorResponse: Errors.API.TOO_MANY_REQUESTS,
    key: Config.RATE_LIMITS.OVERALL_REQUESTS_KEY,
    points: Env.OVERALL_REQUESTS_LIMIT,
  })
);
app.use('/', Main.router({logger}));

app.use(function (req, res) {
  return res.status(404).json(Errors.API.RESOURCE_NOT_FOUND);
});

module.exports = app;
