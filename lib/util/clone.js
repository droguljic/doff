// Load modules

const arrayEach = require('./arrayEach');
const enumerableKeys = require('./enumerableKeys');
const isType = require('./isType');

// Internal logic

const dateTag = '[object Date]';
const mapTag = '[object Map]';
const regExpTag = '[object RegExp]';
const setTag = '[object Set]';

// Define exports

module.exports = function clone(value) {
  if (value === null || typeof value !== 'object') {
    return value;
  }

  let output;
  if (isType(value, dateTag)) {
    return new Date(value.getTime());
  } else if (isType(value, mapTag)) {
    return new Map(value);
  } else if (isType(value, regExpTag)) {
    return new RegExp(value);
  } else if (isType(value, setTag)) {
    return new Set(value);
  } else if (Array.isArray(value)) {
    output = [];
  } else {
    output = Object.create(Object.getPrototypeOf(value));
  }

  arrayEach(enumerableKeys(value, true), (key) => {
    output[key] = clone(value[key]);
  });

  return output;
};
