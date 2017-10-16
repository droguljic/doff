'use strict';

// Define exports

module.exports = function(fn, context) {
  return function wrapper(...args) {
    return fn.apply(context, args);
  };
};
