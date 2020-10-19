function isNumber(num, options = {strict: true}) {
  const validNumber = typeof num === 'number' && isFinite(num) && !isNaN(num);

  return (!options.strict && (validNumber || typeof num === 'undefined' || num === null)) || (options.strict && validNumber);
}

module.exports = isNumber;
