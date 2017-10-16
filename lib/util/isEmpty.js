'use strict';

// Load modules

const enumerableKeys = require('./enumerableKeys');
const isArrayLike = require('./isArrayLike');

// Internal logic

const toString = Object.prototype.toString;

const setTag = '[object Set]';
const mapTag = '[object Map]';

// Define exports

module.exports = function isEmpty(value, options = { enumerable: true, symbols: false }) {
  if (value == null) {
    return true;
  } else if (isArrayLike(value)) {
    return !value.length;
  } else if (toString.call(value) === setTag || toString.call(value) === mapTag) {
    return !value.size;
  } else if (typeof value === 'object') {
    if (options.enumerable) {
      return !enumerableKeys(value, options.symbols).length;
    } else {
      return options.symbols ? !Reflect.ownKeys(value).length : !Object.getOwnPropertyNames(value).length;
    }
  }

  return false;
};
