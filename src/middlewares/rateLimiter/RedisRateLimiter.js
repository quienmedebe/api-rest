const {RateLimiterRedis} = require('rate-limiter-flexible');

function RedisRateLimiter(redis, {name, points, duration, errorResponse}) {
  const rateLimiter = new RateLimiterRedis({
    storeClient: redis,
    keyPrefix: name,
    points: points,
    duration: duration,
    errorResponse: errorResponse,
  });

  return async (req, res, next) => {
    const limitPoints = points;
    if (!limitPoints) {
      return next();
    }

    try {
      const limiterResponse = await rateLimiter.consume(req.ip, limitPoints);

      res.set('RateLimit-Limit', String(limitPoints));
      res.set('RateLimit-Remaining', String(limiterResponse.remainingPoints));
      res.set('RateLimit-Reset', new Date(Date.now() + limiterResponse.msBeforeNext).toUTCString());
      console.log('SET HEADERS');
      console.log(res[Object.getOwnPropertySymbols(res)[3]]);

      return next();
    } catch (error) {
      res.set('Retry-After', String(Math.round(error.msBeforeNext / 1000) || 1));
      res.set('RateLimit-Limit', String(limitPoints));
      res.set('RateLimit-Remaining', String(error.remainingPoints));
      res.set('RateLimit-Reset', new Date(Date.now() + error.msBeforeNext).toUTCString());

      return res.status(429).json(errorResponse);
    }
  };
}

module.exports = RedisRateLimiter;
