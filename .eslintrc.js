module.exports = {
  env: {
    commonjs: true,
    node: true,
    es2020: true,
    mocha: true,
  },
  plugins: ['prettier', 'mocha', 'security'],
  extends: ['eslint:recommended', 'plugin:node/recommended', 'plugin:prettier/recommended', 'plugin:mocha/recommended', 'plugin:security/recommended'],
  parserOptions: {
    ecmaVersion: 2020,
    ecmaFeatures: {
      impliedStrict: true,
    },
  },
  settings: {},
  rules: {
    'linebreak-style': ['error', 'unix'],
    'no-unused-vars': 'warn',
    'prettier/prettier': 'off',
    'node/no-unpublished-require': 'off',
  },
};
