'use strict';

// Load modules

const isLength = require('./isLength');
const LocalPath = require('./LocalPath');

// Internal logic

const PATH_REGEX = /(\.)|(\[|(\d+)|\])|([^.[\]]+)/g;
const SEPARATORS = new Set(['.', '[', ']']);

// Define exports

module.exports = function pathToArray(path) {
  const output = [];
  switch (typeof path) {
    case 'string':
      break; // Continue with function execution
    case 'symbol':
      return [path];
    case 'number':
      return isLength(path) ? [path] : output;
    default:
      return LocalPath.isInstance(path) ? path.asArray : output;
  }

  let match = PATH_REGEX.exec(path);
  while (match != null) {
    if (!SEPARATORS.has(match[0])) {
      output.push(match[0]);
    }

    match = PATH_REGEX.exec(path);
  }

  return output;
};
