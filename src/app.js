const express = require('express');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const winston = require('winston');
const expressWinston = require('express-winston');
const SentryTransport = require('winston-sentry-log');
const crypto = require('crypto');
const {Loggly: LogglyTransport} = require('winston-loggly-bulk');

const apiUI = require('swagger-ui-express');
const apiSpec = require('../swagger.json');

const Config = require('./config');
const Logger = require('./services/logger');
const Email = require('./services/email');

const Middlewares = require('./middlewares');

const Error = require('./modules/errors');
const Auth = require('./modules/auth');
const Routes = require('./routes');

const app = express();

app.use((req, res, next) => {
  res.locals.cspNonce = crypto.randomBytes(16).toString('hex');
  next();
});
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        'script-src': ["'self'", (req, res) => `'nonce-${res.locals.cspNonce}'`],
      },
    },
  })
);
app.use(compression());
app.use(express.static(`${__dirname}/public`));
app.set('views', `${__dirname}/views`);
app.set('view engine', 'pug');
app.use(Middlewares.HttpContext.httpContext.middleware);
app.use(Middlewares.HttpContext.requestIdMiddleware);
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser(Config.COOKIES_SESSION_SECRET));
app.use(cors());
app.use(Auth.passport.client.initialize());

/***
 * Logging
 */
const loggerFormat = winston.format.combine(
  Logger.Formats.withRequestId(() => Middlewares.HttpContext.httpContext.get('reqId'))(),
  winston.format.timestamp(),
  winston.format.json()
);
const isTestEnv = Config.Helpers.isTestEnv;
const isProdEnv = Config.Helpers.isProductionEnv;

const activeConsole = (isTestEnv && Config.Logger.ACTIVE_TEST_CONSOLE) || (!isTestEnv && !Config.Logger.DISABLE_CONSOLE);
const consoleTransport = new winston.transports.Console({
  timestamp: true,
  silent: !activeConsole,
});

const sentryActive = isProdEnv && Config.Logger.LOGGER_USE_SENTRY;
const sentryTransport = sentryActive
  ? new SentryTransport({
      config: {
        dsn: Config.Logger.SENTRY_DSN,
      },
      silent: !sentryActive,
    })
  : null;

const logglyActive = isProdEnv && Config.Logger.LOGGER_USE_LOGGLY;
const logglyTransport = logglyActive
  ? new LogglyTransport({
      token: Config.Logger.LOGGLY_TOKEN,
      subdomain: Config.Logger.LOGGLY_SUBDOMAIN,
      tags: [Config.Logger.LOGGLY_TAG],
      json: true,
      timestamp: true,
      silent: !logglyActive,
    })
  : null;

const logger = winston.createLogger({
  format: loggerFormat,
  transports: [consoleTransport, sentryTransport, logglyTransport].filter(Boolean),
});

const expressLogger = expressWinston.logger({
  format: loggerFormat,
  transports: [consoleTransport, sentryTransport, logglyTransport].filter(Boolean),
});

app.use(expressLogger);

/***
 * Email
 */
const emailStrategy = Email.getStrategyByName(Config.Email.EMAIL_STRATEGY, Config.Email, {logger, makeApiCall: Config.Email.SEND_REAL_EMAILS});
Email.useStrategy(emailStrategy);

/***
 * PASSPORT
 */
Auth.passport.client.use(Auth.passport.Strategies.LocalStrategy());
Auth.passport.client.use(
  Auth.passport.Strategies.GoogleStrategy({
    clientId: Config.Auth.GOOGLE_CLIENT_ID,
    clientSecret: Config.Auth.GOOGLE_CLIENT_SECRET,
    callbackUrl: Config.Auth.GOOGLE_CALLBACK_URL,
  })
);
Auth.passport.client.use(
  Auth.passport.Strategies.AppleStrategy({
    clientId: Config.Auth.APPLE_CLIENT_ID,
    teamId: Config.Auth.APPLE_TEAM_ID,
    keyId: Config.Auth.APPLE_KEY_ID,
    privateKeyLocation: Config.Auth.APPLE_PRIVATE_KEY_LOCATION,
    callbackUrl: Config.Auth.APPLE_CALLBACK_URL,
  })
);
Auth.passport.client.use(Auth.passport.Strategies.JWTStrategy(Config.ACCESS_TOKEN_SECRET));

/***
 * ROUTES
 */
app.use('/', Routes.main({logger}));
app.use('/auth', Routes.auth({logger, config: Config, passport: Auth.passport.client}));
app.use('/debt', Routes.debt({logger, config: Config}));

/***
 * DOCUMENTATION
 */
if (Config.NODE_ENV === 'development') {
  app.use('/docs', apiUI.serve, apiUI.setup(apiSpec));
}

app.use((_, res) => {
  return Error.sendApiError(res, Error.API.RESOURCE_NOT_FOUND);
});

// eslint-disable-next-line --- The error handler requires four parameters even if some are unused
app.use(async (err, req, res, _) => {
  await Error.handleError(err, {logger});
  return Error.sendApiError(res, Error.API.INTERNAL_SERVER_ERROR);
});

process.on('uncaughtException', err => {
  logger.error('Uncaught exception', err);
  throw err;
});

process.on('unhandledRejection', err => {
  logger.error('Unhandled rejection', err);
});

module.exports = app;
