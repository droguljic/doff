// Load modules

const expect = require('chai').expect;

const has = require('../../lib/util/has');
const LocalPath = require('../../lib/util/LocalPath');

// Describe test cases

describe('util/has', () => {
  it('Finds object only path', () => {
    const object = { a: { b: { c: { d: undefined } } } };
    expect(has(object, 'a')).to.equal(true);
    expect(has(object, 'a.b')).to.equal(true);
    expect(has(object, 'a.b.c')).to.equal(true);
    expect(has(object, 'a.b.c.d')).to.equal(true);
  });

  it('Finds array only path', () => {
    const array = [[[[[17, null]]]]];
    expect(has(array, '[0]')).to.equal(true);
    expect(has(array, '[0][0]')).to.equal(true);
    expect(has(array, '[0][0][0]')).to.equal(true);
    expect(has(array, '[0][0][0][0]')).to.equal(true);
    expect(has(array, '[0][0][0][0][0]')).to.equal(true);
    expect(has(array, '[0][0][0][0][1]')).to.equal(true);
  });

  it('Finds mixed path', () => {
    const object = { a: [{ b: { c: [{ d: 3 }] } }] };
    expect(has(object, 'a')).to.equal(true);
    expect(has(object, 'a[0]')).to.equal(true);
    expect(has(object, 'a[0].b')).to.equal(true);
    expect(has(object, 'a[0].b.c')).to.equal(true);
    expect(has(object, 'a[0].b.c[0]')).to.equal(true);
    expect(has(object, 'a[0].b.c[0].d')).to.equal(true);
  });

  it('Finds flatten path', () => {
    const object = { '[0].a[1].b.c[1][7].d': NaN };
    expect(has(object, '[0].a[1].b.c[1][7].d')).to.equal(true);
  });

  it('Finds symbol path', () => {
    const symbol = Symbol('try');
    const object = { [symbol]: 'awesome' };
    expect(has(object, symbol)).to.equal(true);
  });

  it('Finds the `LocalPath` path', () => {
    const path = new LocalPath().append('how').append('about');
    const object = { how: { about: 'this' } };
    expect(has(object, path)).to.equal(true);
  });

  it('Does not find non existent path', () => {
    const object = { a: { b: 1 }, c: 5 };
    expect(has(object, 'b')).to.equal(false);
    expect(has(object, 'a.c')).to.equal(false);
    expect(has(object, 'c.b')).to.equal(false);
    expect(has(object, 'b.a')).to.equal(false);
    expect(has(object, 'd')).to.equal(false);
  });

  it('Returns `false` when object or path is invalid', () => {
    expect(has(null, '')).to.equal(false);
    expect(has(NaN, Date.now())).to.equal(false);
    expect(has('', 'c.b')).to.equal(false);
    expect(has(false, 87)).to.equal(false);
  });
});
