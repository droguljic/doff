'use strict';

// Internal logic

const functionToString = Function.prototype.toString;
const hasOwnProperty = Object.prototype.hasOwnProperty;
const objectConstructorString = functionToString.call(Object);

// Define exports

module.exports = function isPlainObject(value) {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  if (prototype === null) {
    return true;
  }

  const constructor = hasOwnProperty.call(prototype, 'constructor') && prototype.constructor;

  return typeof constructor === 'function' &&
    constructor instanceof constructor &&
    functionToString.call(constructor) === objectConstructorString;
};
