'use strict';

// Load modules

const isLength = require('./isLength');
const LocalPath = require('./LocalPath');

// Define exports

module.exports = function isPath(value) {
  const type = typeof value;
  return LocalPath.isInstance(value) || type === 'string' || isLength(value) || type === 'symbol';
};
