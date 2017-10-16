'use strict';

// Load modules

const Util = require('../util');

// Internal logic

function blur(value, path, target, options) {
  let paths = Util.get(options, 'paths');
  if (!paths) {
    return value;
  }

  if (typeof paths === 'function') {
    return paths(value, path, target);
  }

  const mask = Util.get(options, 'mask');
  let output = value;
  paths = Array.isArray(paths) ? paths : Array.of(paths);
  Util.arrayEach(paths, (blurry) => {
    if (typeof blurry === 'string' && blurry === Util.get(path, 'asString')) {
      output = mask;
      return false; // Exit the loop
    } else if (Util.isPlainObject(blurry) && Util.has(blurry, path)) {
      output = Util.get(blurry, path);
      return false; // Exit the loop
    }
  });

  return output;
}

blur.resolve = function resolve(options) {
  // Use exported reference to enable stubbing inside tests
  return (value, path, target) => exports.blur(value, path, target, options);
};

// Define exports

exports = module.exports = blur;

exports.blur = blur; // Export as property to enable stubbing inside tests
