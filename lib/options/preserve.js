'use strict';

// Load modules

const Util = require('../util');

// Internal logic

function preserve(value, { asString: path }, options) {
  let keep = false;
  if (Util.get(options, 'arrays') === true) {
    keep = Array.isArray(value);
  }
  if (Util.get(options, 'objects') === true) {
    keep = keep || Util.isExplicitObject(value);
  }

  keep = keep || Util.get(options, 'paths', []).includes(path);
  keep = keep || Util.isType(value, ...Util.get(options, 'types', []));

  return keep;
}

function castToArray(value) {
  if (Array.isArray(value)) {
    return value;
  } else if (typeof value === 'string' || typeof value === 'function') {
    return Array.of(value);
  } else {
    return [];
  }
}

preserve.resolve = function resolve(options) {
  const settings = Object.assign({}, options);
  settings.paths = castToArray(options.paths);
  settings.types = castToArray(options.types);

  // Use exported reference to enable stubbing inside tests
  return (target, path) => exports.preserve(target, path, settings);
};

// Define exports

exports = module.exports = preserve;

exports.preserve = preserve; // Export as property to enable stubbing inside tests
