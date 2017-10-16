'use strict';

// Load modules

const blur = require('./blur');
const preserve = require('./preserve');
const Util = require('../util');
const Wipe = require('./Wipe');

// Define exports

module.exports = function resolve(options) {
  if (!Util.isPlainObject(options)) {
    return {};
  }

  return Util.transform.deep(options, (accumulator, value, key, fragment, { path: { asString: path } }) => {
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
};
