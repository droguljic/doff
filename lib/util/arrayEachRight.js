'use strict';

// Define exports

module.exports = function arrayEach(target, iteratee) {
  let idx = target.length;
  while (idx--) {
    if (iteratee(target[idx], idx, target) === false) {
      break;
    }
  }
};
