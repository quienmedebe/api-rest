const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const {Database} = require('../../../database');

const jwtStrategy = secret => {
  return new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
    },
    async function (payload, done) {
      try {
        if (Date.now() > payload.expires) {
          return done(null, false);
        }
        const account = await Database.functions.auth.getAccountFromId(payload.id);

        if (!account) {
          return done(null, false);
        }

        return done(null, account.toJSON());
      } catch (err) {
        return done(err, false);
      }
    }
  );
};

module.exports = jwtStrategy;
