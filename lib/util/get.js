'use strict';

// Load modules

const arrayEach = require('./arrayEach');
const isPath = require('./isPath');
const pathToArray = require('./pathToArray');
const toProperty = require('./toProperty');

// Internal logic

const hasOwnProperty = Object.prototype.hasOwnProperty;

// Define exports

module.exports = function get(object, path, defaultValue) {
  if (!object || !isPath(path)) {
    return defaultValue;
  }

  const property = toProperty(path);
  if (hasOwnProperty.call(object, property)) {
    return object[property];
  }

  let current = object;
  let result = defaultValue;
  arrayEach(pathToArray(path), (key) => {
    if (!hasOwnProperty.call(current, key)) {
      result = defaultValue;
      return false; // Exit the loop
    }

    current = current[key];
    result = current;
  });

  return result;
};
