// OFF = 0;
// WARN = 1;
// ERROR = 2;

module.exports = {
  env: {
    es2021: true,
    'jest/globals': true,
  },
  extends: ['airbnb-base', 'prettier', 'plugin:jest/recommended'],
  plugins: ['prettier', 'jest'],
  rules: {
    'no-promise-executor-return': [0],
    'arrow-parens': [2, 'as-needed'],
  },
};
