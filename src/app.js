const express = require('express');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const helmet = require('helmet');
const redis = require('redis');
const cors = require('cors');

const apiUI = require('swagger-ui-express');
const apiSpec = require('../swagger.json');

const Config = require('./config');
const Errors = require('./modules/error');
const Middlewares = require('./middlewares');
const Logger = require('./modules/logger');

const Main = require('./modules/main');
const Auth = require('./modules/auth');

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

  const logger = Logger.createHttpLogger(Middlewares.HttpContext.httpContext, {
    console: {
      silent: env.APP_ENV === 'test',
    },
  });

  const redisClient = redis.createClient({
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
  });

  app.use(
    Middlewares.RateLimiter.RedisRateLimiter(redisClient, {
      name: Config.RATE_LIMITS.OVERALL_REQUESTS_KEY,
      points: +env.OVERALL_REQUESTS_LIMIT,
      duration: +env.OVERALL_REQUESTS_DURATION,
      errorResponse: Errors.API.TOO_MANY_REQUESTS,
    })
  );
  /***
   * ROUTES
   */
  app.use('/', Main.createRouter({logger}));
  app.use('/auth', Auth.createRouter({logger}));

  if (app.get('env') === 'development') {
    app.use('/docs', apiUI.serve, apiUI.setup(apiSpec));
  }

  app.use((_, res) => {
    return res.status(404).json(Errors.API.RESOURCE_NOT_FOUND);
  });

  // eslint-disable-next-line --- The error handler requires four parameters even if some are unused
  app.use(async (err, req, res, _) => {
    await Errors.handleError(err, {logger});
    return res.status(500).json(Errors.API.INTERNAL_SERVER_ERROR);
  });

  function close(cb, flush = false) {
    const closeFn = () => {
      const callback = cb;
      redisClient.quit(() => {
        callback();
      });
    };
    if (flush) {
      return redisClient.flushall('ASYNC', closeFn);
    }
    return closeFn();
  }
  app.close = close;

  return app;
}

exports.createApplication = createApplication;
module.exports = exports;
