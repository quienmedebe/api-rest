module.exports = {
  env: {
    commonjs: true,
    node: true,
    es2020: true,
  },
  plugins: ['prettier', 'security'],
  extends: ['eslint:recommended', 'plugin:node/recommended', 'plugin:prettier/recommended', 'plugin:security/recommended'],
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
  },
};
