'use strict';

// Define exports

module.exports = function isLength(value) {
  return typeof value === 'number' && value > -1 && value % 1 === 0;
};
