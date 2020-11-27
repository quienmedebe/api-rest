const Database = require('../../../../../database');

async function callbackFn(payload, done) {
  try {
    const accountResponse = await Database.functions.auth.getAccountFromPublicId(payload.id);

    if (!accountResponse) {
      return done(null, false);
    }

    return done(null, accountResponse.toJSON());
  } catch (err) {
    return done(err, false);
  }
}

module.exports = callbackFn;
