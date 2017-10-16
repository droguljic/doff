'use strict';

// Load modules

const arrayEach = require('./arrayEach');
const bind = require('./bind');
const clone = require('./clone');
const isDeep = require('./isDeep');
const isExplicitObject = require('./isExplicitObject');
const get = require('./get');
const objectOwn = require('./objectOwn');

// Internal logic

const OPTIONS_SYMBOL = Symbol('MERGE_OPTIONS');

function isOptions(options) {
  return get(options, OPTIONS_SYMBOL) != null;
}

function isDeepObject(object) {
  return isExplicitObject(object) && isDeep(object);
}

function isAtomicKey(key, options) {
  return isOptions(options) && get(options, 'atomic.keys', []).includes(key);
}

function isNonValueIgnored(value, options) {
  return value == null && get(options, 'ignore.nonValues') === true;
}

function merge(target, ...sources) {
  arrayEach(sources, (source) => {
    if (!source) {
      return; // Skip to the next iteration
    }

    objectOwn(source, (value, key) => {
      const options = get(this, 'options');
      if (isNonValueIgnored(value, options)) {
        return; // Skip to next iteration
      }

      const atomic = isAtomicKey(key, options);
      if (!atomic && isDeepObject(value) && isDeepObject(target[key])) {
        target[key] = merge(target[key], value);
      } else if (!atomic && Array.isArray(value) && Array.isArray(target[key])) {
        target[key].push(...value);
      } else {
        target[key] = atomic ? value : clone(value);
      }
    });
  });

  return target;
}

merge.with = function(options) {
  return {
    exec: bind(merge, { options: Object.assign({}, options, { [OPTIONS_SYMBOL]: OPTIONS_SYMBOL }) })
  };
};

// Define exports

module.exports = merge;
