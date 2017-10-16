'use strict';

// Load modules

const Util = require('../util');

// Internal logic

const falsy = {
  relaxed(value) {
    return !value && value !== false && value !== 0;
  },
  strict(value) {
    return !value;
  }
};

const empty = {
  loose(value) {
    // Include non-enumerable and symbol keys into calculation
    return falsy.relaxed(value) || Util.isEmpty(value, { enumerable: false, symbols: true });
  },
  relaxed(value) {
    return falsy.relaxed(value) || Util.isEmpty(value);
  },
  strict(value) {
    return falsy.strict(value) || Util.isEmpty(value);
  }
};

function skip() {
  return false;
}

// Define exports

exports.falsy = falsy;

exports.empty = empty;

exports.skip = skip;

exports.resolve = function resolve(value) {
  if (typeof value === 'string' || typeof value === 'boolean') {
    switch (value) {
      case 'falsy.relaxed':
        return falsy.relaxed;
      case 'falsy.strict':
        return falsy.strict;
      case 'empty.loose':
        return empty.loose;
      case 'empty.relaxed':
      case false:
        return empty.relaxed;
      case 'empty.strict':
      case true:
        return empty.strict;
    }
  } else if (typeof value === 'function') {
    return value;
  } else if (Array.isArray(value)) {
    return (object) => value.includes(object);
  }

  return skip;
};
