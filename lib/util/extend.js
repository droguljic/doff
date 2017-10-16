'use strict';

// Load modules

const arrayEach = require('./arrayEach');
const bind = require('./bind');

// Define exports

module.exports = function extend(target, source, context) {
  arrayEach(Reflect.ownKeys(source), (key) => {
    const value = source[key];
    target[key] = context && typeof value === 'function' ? bind(value, context) : value;
  });

  return target;
};
