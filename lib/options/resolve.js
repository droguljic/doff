'use strict';

// Load modules

const blur = require('./blur');
const preserve = require('./preserve');
const Util = require('../util');
const Wipe = require('./Wipe');

// Internal logic

const DEFAULT_INSTRUCTIONS = {
  wipe: Wipe.resolve(),
  blur: blur.resolve()
};

function inspect(instructions) {
  if (!Util.has(instructions, 'wipe')) {
    instructions.wipe = DEFAULT_INSTRUCTIONS.wipe;
  }

  if (!Util.has(instructions, 'blur')) {
    instructions.blur = DEFAULT_INSTRUCTIONS.blur;
  }

  return instructions;
}

// Define exports

module.exports = function resolve(options) {
  if (!Util.isPlainObject(options)) {
    return DEFAULT_INSTRUCTIONS;
  }

  const instructions = Util.transform.deep(options,
    (accumulator, value, key, fragment, { path: { asString: path } }) => {
      switch (path) {
        case 'preserve':
          accumulator[key] = preserve.resolve(value);
          break;
        case 'blur':
          accumulator[key] = blur.resolve(value);
          break;
        case 'wipe':
          accumulator[key] = Wipe.resolve(value);
          break;
        default:
          accumulator[key] = value;
          break;
      }
    }, {
      preserve(value, { asString: path }) {
        return path === 'preserve' || path === 'reference' || path === 'blur' || path === 'wipe';
      }
    });

  return inspect(instructions);
};
