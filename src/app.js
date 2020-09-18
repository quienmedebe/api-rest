const express = require('express');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const helmet = require('helmet');
const redis = require('redis');
const cors = require('cors');

const Config = require('./config');
const Errors = require('./modules/error');
const Middlewares = require('./middlewares');

const Main = require('./modules/main');
const Logger = require('./modules/logger');

function createApplication({env}) {
  const app = express();

  app.use(helmet());
  app.use(compression());
  app.use(express.json());
  app.use(express.urlencoded({extended: false}));
  app.use(cookieParser(env.COOKIES_SESSION_SECRET));
  app.use(cors());

  app.use(Middlewares.HttpContext.httpContext.middleware);
  app.use(Middlewares.HttpContext.requestIdMiddleware);

  const logger = Logger.createHttpLogger(Middlewares.HttpContext.httpContext);

  const redisClient = redis.createClient();

  app.use(
    Middlewares.RateLimiter.RedisRateLimiter(redisClient, {
      name: Config.RATE_LIMITS.OVERALL_REQUESTS_KEY,
      points: env.OVERALL_REQUESTS_LIMIT,
      duration: env.OVERALL_REQUESTS_DURATION,
      errorResponse: Errors.API.TOO_MANY_REQUESTS,
    })
  );
  app.use('/', Main.createRouter({logger}));

  app.use(function (req, res) {
    return res.status(404).json(Errors.API.RESOURCE_NOT_FOUND);
  });

  function close(cb) {
    redisClient.quit(() => {
      cb();
    });
  }
  app.close = close;

  return app;
}

exports.createApplication = createApplication;
module.exports = exports;
