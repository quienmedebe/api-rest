/***
 * Environment helpers
 */
exports.isTestEnv = ['test'].includes(process.env.NODE_ENV);
exports.isProductionEnv = ['production'].includes(process.env.NODE_ENV);

module.exports = exports;
