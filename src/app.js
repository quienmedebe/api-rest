const express = require('express');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');

const apiUI = require('swagger-ui-express');
const apiSpec = require('../swagger.json');

const Env = require('./env');
const Logger = require('./services/logger');

const Middlewares = require('./middlewares');

const Errors = require('./modules/error');
const Main = require('./modules/main');
const Auth = require('./modules/auth');

const app = express();

app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser(Env.COOKIES_SESSION_SECRET));
app.use(cors());

app.use(Middlewares.HttpContext.httpContext.middleware);
app.use(Middlewares.HttpContext.requestIdMiddleware);

/***
 * SERVICES
 */
const logger = Logger.Presets.defaultLogger(Middlewares.HttpContext.httpContext.get('reqId'), {
  consoleOptions: {
    name: 'console',
    silent: Env.DISABLE_CONSOLE || (Env.APP_ENV === 'test' && !Env.ACTIVE_TEST_CONSOLE),
  },
});

/***
 * PASSPORT
 */
Auth.passport.client.use(Auth.passport.Strategies.LocalStrategy());
Auth.passport.client.use(Auth.passport.Strategies.JWTStrategy(Env.TOKEN_SECRET));

/***
 * ROUTES
 */
app.use('/', Main.createRouter({logger}));
app.use('/auth', Auth.createRouter({logger, env: Env}));

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

module.exports = app;
