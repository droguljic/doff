'use strict';

// Load modules

const isLength = require('./isLength');

// Define exports

module.exports = function isArrayLike(value) {
  return value != null && typeof value !== 'function' && isLength(value.length);
};
