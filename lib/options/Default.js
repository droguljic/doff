'use strict';

// Load modules

const Util = require('../util');

// Internal logic

const DEFAULT_OPTIONS = {
  /*
  When true default / instance options won't be merged with provided ones, otherwise merging
   */
  isolate: false,
  /*
  When true target will be mutated, otherwise new one is constructed
  */
  mutate: false,
  /*
  How deep to go, accepts
  - number 0, go all the way
  - number >= 1, go up to the provided depth
  - number <= -1, start from the provided depth
   */
  depth: 0,
  /*
  When true symbol keys will also be take into consideration, otherwise false
   */
  symbols: false,
  /*
  When true values that should be kept will be passed to the wipe, otherwise they won't see the wipe
   */
  fallthrough: false,
  /*
  Denote which values and / or paths will be kept
   */
  preserve: {
    /*
    Keep arrays when wiping
     */
    arrays: false,
    /*
    Keep objects when wiping
     */
    objects: false,
    /*
    Keep path(s) when wiping, accepts
    - string reflecting single path to keep, e.g. 'some.foo[0].bar.path'
    - array[string] with paths to keep, e.g ['first.path[0].is.preserved', 'this.one.also']
     */
    paths: undefined,
    /*
    Keep type(s) when wiping, accepts
    - string reflecting the single type to keep, e.g. '[object Map]', compared against the output of toString
    - function reflecting the single type to keep, e.g. Set, evaluated using instanceof operator
    - array[string|function] with the combination of the previous two
     */
    types: ['[object Date]', '[object RegExp]']
  },
  /*
  Object to take as a reference when wiping paths, i.e. if a reference has a path keep it, otherwise wipe
  */
  reference: undefined,
  /*
  Values to wipe from target, accepts
  - string 'falsy.relaxed', falsy values, excluding 0 and false, will be wiped
  - string 'falsy.strict', falsy values will be wiped
  - string 'empty.loose', falsy values, excluding 0 and false, objects without own keys,
  arrays and likes with length of 0, maps and sets with size of 0, will be wiped
  - string 'empty.relaxed' (alias false), falsy values, excluding 0 and false, objects without own
  string enumerable keys, arrays and likes with length of 0, maps and sets with size of 0, will be wiped
  - string 'empty.strict' (alias true), falsy values, objects without own string enumerable keys,
  arrays and likes with length of 0, maps and sets with size of 0, will be wiped
  - array with values to wipe
  - function with signature (value, path, target) returning true for wiping and false otherwise
  */
  wipe: false,
  blur: {
    /*
    Path(s) to blur, i.e. replace, with mask values, accepts
    - string reflecting single path to blur using value of mask key
    - object where key is the path to blur and the value is a mask to use
    - array[string|object] with combination of previous two
    - function with signature (value, path, target) returning mask to use
     */
    paths: undefined,
    /*
    Mask to use for blur
     */
    mask: '*******'
  }
};

// Define exports

exports = module.exports = DEFAULT_OPTIONS;

exports.use = function(options) {
  if (Util.isPlainObject(options)) {
    Util.merge.with({ atomic: { keys: ['reference'] } }).exec(DEFAULT_OPTIONS, options);
  }
};
