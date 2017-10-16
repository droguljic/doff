'use strict';

// Internal logic

const toString = Object.prototype.toString;

// Define exports

module.exports = function isExplicitObject(value) {
  const tag = toString.call(value);

  return typeof value === 'object' &&
    value !== null &&
    typeof value[Symbol.iterator] !== 'function' &&
    // !Array.isArray(value) && // Covered by Symbol.iterator check
    tag !== '[object ArrayBuffer]' &&
    tag !== '[object SharedArrayBuffer]' &&
    tag !== '[object DataView]' && // Typed arrays are covered by Symbol.iterator check
    // tag !== '[object Generator]' && // Covered by Symbol.iterator check
    // tag !== '[object Map]' && // Covered by Symbol.iterator check
    // tag !== '[object Set]' && // Covered by Symbol.iterator check
    tag !== '[object WeakMap]' &&
    tag !== '[object WeakSet]';
};
