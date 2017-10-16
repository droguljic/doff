'use strict';

// Load modules

const isPath = require('./isPath');
const LocalPath = require('./LocalPath');
const toString = require('./toString');

// Define exports

module.exports = function toLocalPath(fraction, base, target) {
  if (LocalPath.isInstance(fraction)) {
    return fraction;
  }

  const path = new LocalPath();
  if (!isPath(fraction)) {
    return path;
  }

  return path
    .use(base)
    .append(Array.isArray(target) ? `[${fraction}]` : toString(fraction), fraction);
};
