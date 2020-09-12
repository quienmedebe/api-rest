const rateLimiterFactory = ({Store, responseOnError, limiterOptions = {}}) => {
  const rateLimiter = Store;
  const options = limiterOptions;
  const errorResponse = responseOnError;

  return (req, res, next) => {
    const key = typeof options.key === 'function' ? options.key(req) : req.ip;
    const points = options.points !== undefined ? options.points : 1;

    rateLimiter
      .consume(key, points, options)
      .then(() => {
        return next();
      })
      .catch(() => {
        return res.status(429).json(errorResponse);
      });
  };
};

module.exports = rateLimiterFactory;
