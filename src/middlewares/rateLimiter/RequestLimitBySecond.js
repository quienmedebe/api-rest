const {RateLimiterRedis} = require('rate-limiter-flexible');
const LimiterFactory = require('./RequestLimitFactory');

const RequestLimitBySecond = ({redis, errorResponse, key, points = 10}) => {
  return LimiterFactory({
    Store: new RateLimiterRedis({
      storeClient: redis,
      keyPrefix: key,
      points,
      duration: 1,
    }),
    responseOnError: errorResponse,
    limiterOptions: {
      key: req => req.ip,
      points,
    },
  });
};

module.exports = RequestLimitBySecond;
