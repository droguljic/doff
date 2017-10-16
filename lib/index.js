'use strict';

// Load modules

const Doff = require('./Doff');
const Options = require('./options');
const Util = require('./util');

// Internal logic

const INSTANCE = createInstance();

function createInstance(options) {
  const context = new Doff(options);
  const instance = Util.bind(Doff.prototype.aim, context);

  Util.extend(instance, Doff.prototype, context);
  Util.extend(instance, context);

  return instance;
}

// Define exports

exports = module.exports = INSTANCE;

exports.use = function(options) {
  Options.Default.use(options);
  return INSTANCE;
};

exports.create = function(options = {}) {
  if (options.isolate === true) {
    return createInstance(options);
  }

  return createInstance(Util.merge.with({ atomic: { keys: ['reference'] } }).exec({}, Options.Default, options));
};
