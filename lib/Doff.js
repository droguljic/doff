'use strict';

// Load modules

const Options = require('./options');
const Util = require('./util');

// Internal logic

function add(accumulator, value, key, fragment) {
  if (Array.isArray(fragment)) {
    accumulator.push(value);
  } else {
    accumulator[key] = value;
  }
}

function set(accumulator, value, key) {
  accumulator[key] = value;
}

function remove(accumulator, key, fragment) {
  if (Array.isArray(fragment)) {
    accumulator.splice(key, 1);
  } else {
    delete accumulator[key];
  }
}

class Doff {
  constructor(options) {
    this.options = options;
  }

  getOptions() {
    return this.options || Options.Default;
  }

  aim(target, options = {}) {
    let instructions;
    if (options.isolate === true) {
      instructions = Options.resolve(options);
    } else { // Only merge with defaults if isolate is not true
      const merged = Util.merge.with({ atomic: { keys: ['reference'] } }).exec({}, this.getOptions(), options);
      instructions = Options.resolve(merged);
    }

    const { mutate, depth, symbols, fallthrough, preserve, reference, wipe, blur } = instructions;

    return Util.transform.deep(target, (accumulator, value, key, fragment, { path, preserved, object }) => {
      const keep = preserved || Util.has(reference, path);
      const approved = (keep && !fallthrough) || !wipe(value, path, object);
      if (approved && !mutate) {
        add(accumulator, blur(value, path, object), key, fragment); // Blur the value, if appropriate
      } else if (approved && mutate) {
        set(accumulator, blur(value, path, object), key); // Blur the value, if appropriate
      } else if (!approved && mutate) {
        remove(accumulator, key, fragment);
      }
    }, { mutate, depth, symbols, preserve });
  }
}

// Define exports

module.exports = Doff;
