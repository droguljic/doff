'use strict';

// Load modules

const enumerableKeys = require('./enumerableKeys');

// Define exports

module.exports = function isDeep(object, symbols = false) {
  return typeof object === 'object' &&
    object !== null &&
    Boolean(enumerableKeys(object, symbols).length);
};
