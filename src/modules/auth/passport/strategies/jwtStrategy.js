const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const Database = require('../../../../database');
const Shared = require('../../../shared');

const jwtStrategy = secret => {
  return new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
    },
    async function (payload, done) {
      try {
        const parsedId = parseInt(payload.id, 10);
        const accountResponse = await Database.functions.auth.getAccountFromId(parsedId);

        if (Shared.sendResponse.isError(accountResponse)) {
          return done(null, false);
        }

        return done(null, accountResponse.value.toJSON());
      } catch (err) {
        return done(err, false);
      }
    }
  );
};

module.exports = jwtStrategy;
