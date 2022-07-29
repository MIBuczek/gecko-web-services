module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  parserOptions: {
    "ecmaVersion": 8,
  },
  rules: {
    "max-len": ["error", {"code": 100, "comments": 120}],
    "quotes": ["error", "double"],
    "arrow-body-style": 1,
    "camelcase": 0,
    "comma-dangle": 0,
  },
};
