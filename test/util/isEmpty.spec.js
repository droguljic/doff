// Load modules

const expect = require('chai').expect;

const isEmpty = require('../../lib/util/isEmpty');

// Describe test cases

describe('util/isEmpty', () => {
  it('Identifies empty values', () => {
    expect(isEmpty(undefined)).to.equal(true);
    expect(isEmpty(null)).to.equal(true);
    expect(isEmpty('')).to.equal(true);
    expect(isEmpty([])).to.equal(true);
    expect(isEmpty(new Int8Array(0))).to.equal(true);
    expect(isEmpty(new Uint8Array(0))).to.equal(true);
    expect(isEmpty(new Uint8ClampedArray(0))).to.equal(true);
    expect(isEmpty(new Int16Array(0))).to.equal(true);
    expect(isEmpty(new Uint16Array(0))).to.equal(true);
    expect(isEmpty(new Int32Array(0))).to.equal(true);
    expect(isEmpty(new Uint32Array(0))).to.equal(true);
    expect(isEmpty(new Float32Array(0))).to.equal(true);
    expect(isEmpty(new Float64Array(0))).to.equal(true);
    expect(isEmpty(new Map())).to.equal(true);
    expect(isEmpty(new Set())).to.equal(true);
    expect(isEmpty(new WeakSet([{ plain: 'object' }]))).to.equal(true);
    expect(isEmpty(new WeakMap([[{}, {}]]))).to.equal(true);
    expect(isEmpty({ length: 0 })).to.equal(true);
    expect(isEmpty({})).to.equal(true);
    expect(isEmpty(new Date())).to.equal(true);
    expect(isEmpty(/test-this/)).to.equal(true);
  });

  it('Identifies non empty values', () => {
    expect(isEmpty(false)).to.equal(false);
    expect(isEmpty(7)).to.equal(false);
    expect(isEmpty('how')).to.equal(false);
    expect(isEmpty([9])).to.equal(false);
    expect(isEmpty(new Int8Array(1))).to.equal(false);
    expect(isEmpty(new Uint8Array(1))).to.equal(false);
    expect(isEmpty(new Uint8ClampedArray(1))).to.equal(false);
    expect(isEmpty(new Int16Array(1))).to.equal(false);
    expect(isEmpty(new Uint16Array(1))).to.equal(false);
    expect(isEmpty(new Int32Array(1))).to.equal(false);
    expect(isEmpty(new Uint32Array(1))).to.equal(false);
    expect(isEmpty(new Float32Array(1))).to.equal(false);
    expect(isEmpty(new Float64Array(1))).to.equal(false);
    expect(isEmpty(new Map([['now', 'try']]))).to.equal(false);
    expect(isEmpty(new Set([5]))).to.equal(false);
    expect(isEmpty({ length: 11 })).to.equal(false);
    expect(isEmpty({ key: 'value' })).to.equal(false);
    expect(isEmpty(() => {})).to.equal(false);
  });

  it('Respects options', () => {
    const stringObject = Object.defineProperty({}, 'string', { value: 'value' });
    const symbolObject = Object.defineProperty({}, Symbol('symbol'), { value: 'value' });

    expect(isEmpty(/test-this/, { enumerable: false, symbols: false })).to.equal(false);
    expect(isEmpty(stringObject, { enumerable: false, symbols: false })).to.equal(false);
    expect(isEmpty(symbolObject, { enumerable: false, symbols: false })).to.equal(true);

    expect(isEmpty(/test-this/, { enumerable: false, symbols: true })).to.equal(false);
    expect(isEmpty(stringObject, { enumerable: false, symbols: true })).to.equal(false);
    expect(isEmpty(symbolObject, { enumerable: false, symbols: true })).to.equal(false);

    expect(isEmpty(/test-this/, { enumerable: true, symbols: false })).to.equal(true);
    expect(isEmpty(stringObject, { enumerable: true, symbols: false })).to.equal(true);
    expect(isEmpty(symbolObject, { enumerable: true, symbols: false })).to.equal(true);

    expect(isEmpty(/test-this/, { enumerable: true, symbols: true })).to.equal(true);
    expect(isEmpty(stringObject, { enumerable: true, symbols: true })).to.equal(true);
    expect(isEmpty(symbolObject, { enumerable: true, symbols: true })).to.equal(true);
  });
});
