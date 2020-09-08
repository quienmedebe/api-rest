module.exports = {
  "env": {
    "commonjs": true,
    "node": true,
    "es2020": true
  },
  "plugins": [

  ],
  "extends": ["eslint:recommended", "plugin:node/recommended"],
  "parserOptions": {
    "ecmaVersion": 2020,
    "ecmaFeatures": {
      "impliedStrict": true
    }
  },
  "settings": {},
  "rules": {
    "linebreak-style": ["error", "unix"],
    "no-unused-vars": "warn"
  }
};