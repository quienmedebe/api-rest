const express = require('express');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const winston = require('winston');
const SentryTransport = require('winston-sentry');
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

app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser(Config.COOKIES_SESSION_SECRET));
app.use(cors());
app.use(Auth.passport.client.initialize());

app.use(Middlewares.HttpContext.httpContext.middleware);
app.use(Middlewares.HttpContext.requestIdMiddleware);

/***
 * Logging
 */
const reqId = Middlewares.HttpContext.httpContext.get('reqId');
const loggerFormat = winston.format.combine(Logger.Formats.withRequestId(reqId)(), winston.format.timestamp(), winston.format.json());
const consoleTransport = new winston.transports.Console({
  timestamp: true,
  silent: Config.Logger.DISABLE_CONSOLE || (['test'].includes(Config.NODE_ENV) && !Config.Logger.ACTIVE_TEST_CONSOLE),
});
const sentryTransport = new SentryTransport({
  timestamp: true,
  silent: !Config.Logger.LOGGER_USE_SENTRY,
});

const logglyTransport = new LogglyTransport({
  token: Config.Logger.LOGGLY_TOKEN,
  subdomain: Config.Logger.LOGGLY_SUBDOMAIN,
  tags: ['QMD'],
  json: true,
  timestamp: true,
  silent: !Config.Logger.LOGGER_USE_LOGGLY,
});

const logger = winston.createLogger({
  format: loggerFormat,
  transports: [consoleTransport, logglyTransport, sentryTransport],
});

/***
 * Email
 */
const emailStrategy = Email.getStrategyByName(Config.Email.EMAIL_STRATEGY, Config.Email);
Email.useStrategy(emailStrategy);

/***
 * PASSPORT
 */
Auth.passport.client.use(Auth.passport.Strategies.LocalStrategy());
Auth.passport.client.use(Auth.passport.Strategies.JWTStrategy(Config.ACCESS_TOKEN_SECRET));

/***
 * ROUTES
 */
app.use('/', Routes.main({logger}));
app.use('/auth', Routes.auth({logger, config: Config}));

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
