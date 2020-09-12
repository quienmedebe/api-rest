const {RateLimiterRedis} = require('rate-limiter-flexible');
const LimiterFactory = require('./RequestLimitFactory');

const RequestLimitBySecond = ({redis, errorResponse, key, limit = 10}) => {
  return LimiterFactory({
    Store: new RateLimiterRedis({
      storeClient: redis,
      keyPrefix: key,
      points: limit,
      duration: 1,
    }),
    responseOnError: errorResponse,
    limiterOptions: {
      key: req => req.ip,
    },
  });
};

module.exports = RequestLimitBySecond;
