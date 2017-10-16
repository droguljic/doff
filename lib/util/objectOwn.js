'use strict';

// Load modules

const enumerableKeys = require('./enumerableKeys');

// Define exports

module.exports = function objectOwn(object, iteratee, symbols = false) {
  const keys = enumerableKeys(object, symbols);
  for (let idx = 0, len = keys.length; idx < len; idx++) {
    const key = keys[idx];
    if (iteratee(object[key], key, object) === false) {
      break;
    }
  }
};
