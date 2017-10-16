'use strict';

// Define exports

module.exports = function arrayEach(target, iteratee) {
  for (let idx = 0, len = target.length; idx < len; idx++) {
    if (iteratee(target[idx], idx, target) === false) {
      break;
    }
  }
};
