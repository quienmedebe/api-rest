const express = require('express');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');

const apiUI = require('swagger-ui-express');
const apiSpec = require('../swagger.json');

const Config = require('./config');
const Logger = require('./services/logger');

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
 * SERVICES
 */
const logger = Logger.Presets.defaultLogger(Middlewares.HttpContext.httpContext.get('reqId'), {
  consoleOptions: {
    name: 'console',
    silent: Config.DISABLE_CONSOLE || (Config.APP_ENV === 'test' && !Config.ACTIVE_TEST_CONSOLE),
  },
});

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

if (app.get('env') === 'development') {
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

module.exports = app;
