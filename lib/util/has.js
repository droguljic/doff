'use strict';

// Load modules

const arrayEach = require('./arrayEach');
const isPath = require('./isPath');
const pathToArray = require('./pathToArray');
const toProperty = require('./toProperty');

// Internal logic

const hasOwnProperty = Object.prototype.hasOwnProperty;

// Define exports

module.exports = function has(object, path) {
  if (!object || !isPath(path)) {
    return false;
  }

  if (hasOwnProperty.call(object, toProperty(path))) {
    return true;
  }

  let current = object;
  let result = false;
  arrayEach(pathToArray(path), (key) => {
    if (!hasOwnProperty.call(current, key)) {
      result = false;
      return result; // Exit the loop
    }

    current = current[key];
    result = true;
  });

  return result;
};
