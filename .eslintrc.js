// OFF = 0;
// WARN = 1;
// ERROR = 2;

module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'no-promise-executor-return': [0],
    'arrow-parens': [2, 'as-needed'],
  },
};
