// Load modules

const expect = require('chai').expect;

const isArrayLike = require('../../lib/util/isArrayLike');

// Describe test cases

describe('util/isArrayLike', () => {
  it('Identifies array like values', () => {
    expect(isArrayLike([])).to.equal(true);
    expect(isArrayLike('')).to.equal(true);
    expect(isArrayLike(new Int8Array(7))).to.equal(true);
    expect(isArrayLike(new Uint8Array(7))).to.equal(true);
    expect(isArrayLike(new Uint8ClampedArray(7))).to.equal(true);
    expect(isArrayLike(new Int16Array(7))).to.equal(true);
    expect(isArrayLike(new Uint16Array(7))).to.equal(true);
    expect(isArrayLike(new Int32Array(7))).to.equal(true);
    expect(isArrayLike(new Uint32Array(7))).to.equal(true);
    expect(isArrayLike(new Float32Array(7))).to.equal(true);
    expect(isArrayLike(new Float64Array(7))).to.equal(true);
    expect(isArrayLike({ length: 17 })).to.equal(true);
  });

  it('Identifies non array like values', () => {
    expect(isArrayLike(undefined)).to.equal(false);
    expect(isArrayLike(null)).to.equal(false);
    expect(isArrayLike(3)).to.equal(false);
    expect(isArrayLike(true)).to.equal(false);
    expect(isArrayLike({})).to.equal(false);
    expect(isArrayLike(new Set())).to.equal(false);
    expect(isArrayLike(new Map())).to.equal(false);
    expect(isArrayLike(new WeakMap())).to.equal(false);
    expect(isArrayLike(new WeakSet())).to.equal(false);
    expect(isArrayLike(new ArrayBuffer(5))).to.equal(false);
    expect(isArrayLike(new DataView(new ArrayBuffer(9)))).to.equal(false);
    expect(isArrayLike(() => {})).to.equal(false);
  });
});
