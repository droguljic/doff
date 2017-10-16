'use strict';

// Load modules

const arrayEach = require('./arrayEach');

// Internal logic

const isEnumerable = Object.prototype.propertyIsEnumerable;

// Define exports

module.exports = function enumerableKeys(target, symbols) {
  const keys = [];
  if (target == null || typeof target !== 'object') {
    return keys;
  }

  keys.push(...Object.keys(target));
  if (symbols === true) {
    arrayEach(Object.getOwnPropertySymbols(target), (symbol) => {
      if (isEnumerable.call(target, symbol)) {
        keys.push(symbol);
      }
    });
  }

  return keys;
};
