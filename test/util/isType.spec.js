// Load modules

const expect = require('chai').expect;

const isType = require('../../lib/util/isType');

// Internal logic

function Something() {}

// Describe test cases

describe('util/isType', () => {
  it('Identifies types', () => {
    expect(isType(new Map(), Set, '[object Map]')).to.equal(true);
    expect(isType([], Array)).to.equal(true);
    expect(isType(new Date(), Date)).to.equal(true);
    expect(isType(new Something(), Boolean, Number, Something)).to.equal(true);
    expect(isType(/test/, '[object Array]', '[object RegExp]')).to.equal(true);
    expect(isType({}, '[object Object]')).to.equal(true);
    expect(isType(new WeakSet(), WeakMap, WeakSet));
    expect(isType(new ArrayBuffer(), '[object ArrayBuffer]')).to.equal(true);
    expect(isType(3, '[object Number]')).to.equal(true);
    expect(isType(3, Number)).to.equal(false);
    expect(isType('???')).to.equal(false);
    expect(isType(undefined)).to.equal(false);
    expect(isType(null)).to.equal(false);
  });
});
