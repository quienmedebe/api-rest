const express = require('express');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const helmet = require('helmet');
const redis = require('redis');
const {RateLimiterRedis} = require('rate-limiter-flexible');

const Errors = require('./modules/error');
const Main = require('./modules/main');
const Middlewares = require('./middlewares');

const app = express();

app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

const redisClient = redis.createClient();

const RequestLimitBySecond = Middlewares.rateLimiterFactory({
  Store: new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'DoS',
    points: 10,
    duration: 1,
  }),
  responseOnError: Errors.API.TOO_MANY_REQUESTS,
  limiterOptions: {
    key: req => req.ip,
  },
});

app.use(RequestLimitBySecond);
app.use('/', Main.router);

module.exports = app;
