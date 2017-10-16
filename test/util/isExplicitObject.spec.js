// Load modules

const expect = require('chai').expect;

const isExplicitObject = require('../../lib/util/isExplicitObject');

// Internal logic

function Instance() {}

function* generator() {
  yield 11;
  return 19;
}

const iterator = {
  [Symbol.iterator]() {
    return {
      next: () => ({ done: true })
    };
  }
};

// Describe test cases

describe('util/isExplicitObject', () => {
  it('Should identify objects', () => {
    expect(isExplicitObject({})).to.equal(true);
    expect(isExplicitObject({ simple: 7 })).to.equal(true);
    expect(isExplicitObject(Object.create(null))).to.equal(true);
    expect(isExplicitObject(Promise.resolve())).to.equal(true);
    expect(isExplicitObject(new Date())).to.equal(true);
    expect(isExplicitObject(new RegExp('try-it'))).to.equal(true);
    expect(isExplicitObject(new Error())).to.equal(true);
    expect(isExplicitObject(new Instance())).to.equal(true);
  });

  it('Should identify non objects', () => {
    expect(isExplicitObject(undefined)).to.equal(false);
    expect(isExplicitObject(null)).to.equal(false);
    expect(isExplicitObject(false)).to.equal(false);
    expect(isExplicitObject(3)).to.equal(false);
    expect(isExplicitObject('yes')).to.equal(false);
    expect(isExplicitObject([])).to.equal(false);
    expect(isExplicitObject(new ArrayBuffer(1))).to.equal(false);
    expect(isExplicitObject(new DataView(new ArrayBuffer(1)))).to.equal(false);
    expect(isExplicitObject(new Int8Array(1))).to.equal(false);
    expect(isExplicitObject(new Uint8Array(1))).to.equal(false);
    expect(isExplicitObject(new Uint8ClampedArray(1))).to.equal(false);
    expect(isExplicitObject(new Int16Array(1))).to.equal(false);
    expect(isExplicitObject(new Uint16Array(1))).to.equal(false);
    expect(isExplicitObject(new Int32Array(1))).to.equal(false);
    expect(isExplicitObject(new Uint32Array(1))).to.equal(false);
    expect(isExplicitObject(new Float32Array(1))).to.equal(false);
    expect(isExplicitObject(new Float64Array(1))).to.equal(false);
    expect(isExplicitObject(new Map())).to.equal(false);
    expect(isExplicitObject(new Set())).to.equal(false);
    expect(isExplicitObject(new WeakMap())).to.equal(false);
    expect(isExplicitObject(new WeakSet())).to.equal(false);
    expect(isExplicitObject(() => {})).to.equal(false);
    expect(isExplicitObject(generator)).to.equal(false);
    expect(isExplicitObject(generator())).to.equal(false);
    expect(isExplicitObject(iterator)).to.equal(false);
  });
});
