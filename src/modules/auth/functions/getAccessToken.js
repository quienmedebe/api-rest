const signToken = require('./signToken');

function getAccessToken(req, res, payload, options = {}) {
  const noSession = {session: false};

  return req.login(payload, noSession, err => {
    if (err) {
      return Error.sendApiError(res, Error.API.UNAUTHORIZED);
    }

    const jwtHeader = {
      expiresIn: parseInt(options.expiresIn, 10),
    };

    const jwtConfig = {
      secret: options.secret,
      logger: options.logger,
    };

    const token = signToken(payload, jwtHeader, jwtConfig);

    const response = {
      access_token: token,
    };
    return res.status(200).json(response);
  });
}

module.exports = getAccessToken;
