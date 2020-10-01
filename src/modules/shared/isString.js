function isString(str, options = {}) {
  const strict = !!options.strict;

  const isTypeString = typeof str === 'string';
  return isTypeString || (!str && !strict);
}

module.exports = isString;
