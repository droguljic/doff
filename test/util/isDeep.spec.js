// Load modules

const expect = require('chai').expect;

const isDeep = require('../../lib/util/isDeep');

// Internal logic

const symbolObject = Object.defineProperty({}, Symbol('symbol'), { value: 'real', enumerable: true });

// Describe test cases

describe('util/isDeep', () => {
  it('Should identify deep values', () => {
    expect(isDeep([11])).to.equal(true);
    expect(isDeep(new Int8Array(7))).to.equal(true);
    expect(isDeep(new Uint8Array(7))).to.equal(true);
    expect(isDeep(new Uint8ClampedArray(7))).to.equal(true);
    expect(isDeep(new Int16Array(7))).to.equal(true);
    expect(isDeep(new Uint16Array(7))).to.equal(true);
    expect(isDeep(new Int32Array(7))).to.equal(true);
    expect(isDeep(new Uint32Array(7))).to.equal(true);
    expect(isDeep(new Float32Array(7))).to.equal(true);
    expect(isDeep(new Float64Array(7))).to.equal(true);
    expect(isDeep({ test: 'it' })).to.equal(true);
    expect(isDeep(symbolObject, true)).to.equal(true);
  });

  it('Should identify non deep values', () => {
    expect(isDeep(undefined)).to.equal(false);
    expect(isDeep(null)).to.equal(false);
    expect(isDeep(true)).to.equal(false);
    expect(isDeep(17)).to.equal(false);
    expect(isDeep('???')).to.equal(false);
    expect(isDeep(new Date())).to.equal(false);
    expect(isDeep(/test-it/)).to.equal(false);
    expect(isDeep(new Set([1, 3, 5]))).to.equal(false);
    expect(isDeep(new Map([[1, 3], [5, 7]]))).to.equal(false);
    expect(isDeep(new WeakSet([{}]))).to.equal(false);
    expect(isDeep(new WeakMap([[{}, {}]]))).to.equal(false);
    expect(isDeep(new ArrayBuffer(5))).to.equal(false);
    expect(isDeep(new DataView(new ArrayBuffer(9)))).to.equal(false);
    expect(isDeep([])).to.equal(false);
    expect(isDeep(new Int8Array(0))).to.equal(false);
    expect(isDeep(new Uint8Array(0))).to.equal(false);
    expect(isDeep(new Uint8ClampedArray(0))).to.equal(false);
    expect(isDeep(new Int16Array(0))).to.equal(false);
    expect(isDeep(new Uint16Array(0))).to.equal(false);
    expect(isDeep(new Int32Array(0))).to.equal(false);
    expect(isDeep(new Uint32Array(0))).to.equal(false);
    expect(isDeep(new Float32Array(0))).to.equal(false);
    expect(isDeep(new Float64Array(0))).to.equal(false);
    expect(isDeep({})).to.equal(false);
    expect(isDeep(symbolObject)).to.equal(false);
    expect(isDeep(() => {})).to.equal(false);
  });
});
