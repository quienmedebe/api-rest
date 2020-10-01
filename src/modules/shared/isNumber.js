function isNumber(num) {
  return typeof num === 'number' && isFinite(num) && !isNaN(num);
}

module.exports = isNumber;
