module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",

    // put prettier at last to disable invalid rules.
    "plugin:prettier/recommended",
    "prettier/react",
  ],
  rules: {
    // "@typescript-eslint/camelcase": 0,
  },
};
