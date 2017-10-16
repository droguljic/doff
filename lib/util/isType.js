'use strict';

// Load modules

const arrayEach = require('./arrayEach');

const toString = Object.prototype.toString;

// Define exports

module.exports = function(value, ...types) {
  let is = false;
  if (value == null) {
    return is;
  }

  arrayEach(types, (type) => {
    if ((typeof type === 'string' && toString.call(value) === type) ||
        ((typeof type === 'function') && value instanceof type)) {
      is = true;
      return false; // Break the loop
    }
  });

  return is;
};
