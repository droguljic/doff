'use strict';

// Load modules

const isLength = require('./isLength');
const LocalPath = require('./LocalPath');
const toString = require('./toString');

// Define exports

module.exports = function toProperty(value) {
  const type = typeof value;
  if (type === 'string' || type === 'symbol' || isLength(value)) {
    return value;
  } else if (LocalPath.isInstance(value)) {
    return value.asString;
  }

  return toString(value);
};
