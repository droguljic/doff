'use strict';

// Load modules

const arrayEach = require('./arrayEach');
const arrayEachRight = require('./arrayEachRight');
const isDeep = require('./isDeep');
const merge = require('./merge');
const objectOwn = require('./objectOwn');
const toLocalPath = require('./toLocalPath');

// Internal logic

function preserve() {
  return false; // By default nothing is preserved
}

function hasDepth(target, { level, depth, symbols }) {
  return isDeep(target, symbols) && (depth <= 0 || level < depth);
}

function advance(state) {
  const output = Object.assign({}, state);
  output.level++;

  return output;
}

function isSkip({ level, depth }) {
  if (depth < 0) {
    return level <= Math.abs(depth);
  }

  return false;
}

function transform(target, iteratee, { mutate = false, symbols = false } = {}) {
  const isArray = Array.isArray(target);
  let accumulator = target;
  if (mutate !== true) {
    if (isArray) {
      accumulator = [];
    } else if (target && typeof target.constructor === 'function') {
      accumulator = Object.create(Object.getPrototypeOf(target));
    } else {
      accumulator = {};
    }
  }

  const arrayLoop = mutate ? arrayEachRight : arrayEach; // Go in reverse order when mutating to ease the removal
  const loop = isArray ? arrayLoop : objectOwn;
  loop(target, (value, key, object) => iteratee(accumulator, value, key, object), symbols);

  return accumulator;
}

function deep(target, base, iteratee, state) {
  const { object, mutate, symbols } = state;
  return transform(target, (accumulator, value, key, fragment) => {
    let element = value;
    let path = toLocalPath(key, base, fragment);
    const preserved = state.preserve(element, path);
    if (!preserved && state.hasDepth(element, state)) {
      element = deep(element, path, iteratee, advance(state));
    }

    if (!isSkip(state)) { // Call iteratee if not skipping this level
      iteratee(accumulator, element, key, fragment, { path, preserved, object });
    }
  }, { mutate, symbols });
}

transform.deep = function(target, iteratee, options = {}) {
  const state = { object: target, level: 1, depth: 0, preserve, hasDepth };
  merge.with({ ignore: { nonValues: true } }).exec(state, options);

  return deep(target, undefined, iteratee, state);
};

// Define exports

module.exports = transform;
