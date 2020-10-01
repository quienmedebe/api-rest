const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const {Database} = require('../../../database');

const jwtStrategy = (name, secret) => {
  return new JWTStrategy(
    name,
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
    },
    async function (payload, done) {
      const account = await Database.functions.getAccountFromId(payload.id);

      if (!account) {
        return done(null, false);
      }

      return done(null, account);
    }
  );
};

module.exports = jwtStrategy;
