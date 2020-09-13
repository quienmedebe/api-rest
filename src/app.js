const express = require('express');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const helmet = require('helmet');
const redis = require('redis');

const Config = require('./config');
const Env = require('./env');
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

if (Env.OVERALL_REQUESTS_LIMIT > 0) {
  app.use(
    Middlewares.RateLimiter.RequestLimitBySecond({
      redis: redisClient,
      errorResponse: Errors.API.TOO_MANY_REQUESTS,
      key: Config.RATE_LIMITS.OVERALL_REQUESTS_KEY,
      limit: Env.OVERALL_REQUESTS_LIMIT,
    })
  );
}
app.use('/', Main.router);

app.use(function (req, res) {
  return res.status(req.status || 404).json({
    error: 'NOT_FOUND',
    message: 'Resource not found',
  });
});

module.exports = app;
