const express = require('express');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');

const apiUI = require('swagger-ui-express');
const apiSpec = require('../swagger.json');

const Redis = require('./services/redis');
const Logger = require('./services/logger');

const Config = require('./config');
const Middlewares = require('./middlewares');

const Errors = require('./modules/error');
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

  const logger = Logger.Presets.defaultLogger(Middlewares.HttpContext.httpContext.get('reqId'), {
    consoleOptions: {
      name: 'console',
      silent: env.DISABLE_CONSOLE || (env.APP_ENV === 'test' && !env.ACTIVE_TEST_CONSOLE),
    },
  });

  Redis.connect({
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
  });
  const redis = Redis.getClient();

  const generalRateLimiter = Middlewares.RateLimiter.RedisRateLimiter(redis, {
    name: Config.RATE_LIMITS.GENERAL_REQUESTS_KEY,
    points: env.GENERAL_REQUESTS_LIMIT,
    duration: env.GENERAL_REQUESTS_DURATION,
    errorResponse: Errors.API.TOO_MANY_REQUESTS,
  });

  app.use(generalRateLimiter);

  /***
   * PASSPORT
   */
  Auth.passport.client.use(Auth.passport.Strategies.LocalStrategy());
  Auth.passport.client.use(Auth.passport.Strategies.JWTStrategy(env.TOKEN_SECRET));

  /***
   * ROUTES
   */
  app.use('/', Main.createRouter({logger}));
  app.use('/auth', Auth.createRouter({logger, env}));

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

  async function close(cb, flush = false) {
    if (flush) {
      return redis.end(true);
    }
    await redis.quitAsync();

    return cb();
  }
  app.close = close;

  return app;
}

exports.createApplication = createApplication;
module.exports = exports;
