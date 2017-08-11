module.exports = {
  extends: ['semistandard'],
  env: {
    browser: true,
    node: true,
    es6: true,
    mocha: true
  },
  rules: {
    'no-console': 'warn',
    'global-require': 'error',
    'max-len': ['error', 120, 2, { ignoreComments: false }],
    'generator-star-spacing': ['error', { before: false, after: false }],
    'space-before-function-paren': ['error', 'never']
  }
};
