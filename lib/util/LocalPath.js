'use strict';

// Internal logic

const IS_INDEX = /\[[0-9]+\]/;
const ENDS_WITH_INDEX = /^.*\[[0-9]+\]$/;
const STRING_TAG = 'LocalPath';

// Define exports

module.exports = class LocalPath {
  constructor() {
    this.asString = '';
    this.asArray = [];
  }

  static isInstance(value) {
    if (value == null || typeof value !== 'object') {
      return false;
    }

    return value[Symbol.toStringTag] === STRING_TAG;
  }

  isEmpty() {
    return this.asString.length === 0 && this.asArray.length === 0;
  }

  use(base) {
    if (!LocalPath.isInstance(base)) {
      return this;
    }

    const str = this.asString;
    this.asString = `${str}${this.isEmpty() || ENDS_WITH_INDEX.test(str) ? '' : '.'}${base.asString}`;
    this.asArray.push(...base.asArray);

    return this;
  }

  append(string, value) {
    this.asString = `${this.asString}${this.isEmpty() || IS_INDEX.test(string) ? '' : '.'}${string}`;
    this.asArray.push(arguments.length === 1 ? string : value);

    return this;
  }

  get [Symbol.toStringTag]() {
    return STRING_TAG;
  }
};
