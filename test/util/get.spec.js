// Load modules

const expect = require('chai').expect;

const get = require('../../lib/util/get');
const LocalPath = require('../../lib/util/LocalPath');

// Describe test cases

describe('util/get', () => {
  it('Should get object only path', () => {
    const object = { a: { b: { c: { d: 81 } } } };
    expect(get(object, 'a.b.c.d')).to.equal(81);
  });

  it('Should get array only path', () => {
    const array = [[[[[17, null]]]]];
    expect(get(array, '[0][0][0][0][0]')).to.equal(17);
    expect(get(array, '[0][0][0][0][1]')).to.equal(null);
  });

  it('Should get mixed path', () => {
    const object = { a: [{ b: { c: [{ d: 3 }] } }] };
    expect(get(object, 'a[0].b.c[0].d')).to.equal(3);
  });

  it('Should get flatten path', () => {
    const object = { '[0].a[1].b.c[1][7].d': 'value' };
    expect(get(object, '[0].a[1].b.c[1][7].d')).to.equal('value');
  });

  it('Should get symbol path', () => {
    const symbol = Symbol('try');
    const object = { [symbol]: 'awesome' };
    expect(get(object, symbol)).to.equal('awesome');
  });

  it('Should get the LocalPath path', () => {
    const path = new LocalPath().append('how').append('about');
    const object = { how: { about: 'this' } };
    expect(get(object, path)).to.equal('this');
  });

  it('Should get default value for non existent path', () => {
    const object = { a: { b: 1 }, c: 5 };
    expect(get(object, 'b', 7)).to.equal(7);
    expect(get(object, 'a.c')).to.equal(undefined);
    expect(get(object, 'c.b', false)).to.equal(false);
    expect(get(object, 'b.a', 'something')).to.equal('something');
  });

  it('Should get default value when object or path is invalid', () => {
    expect(get(null, '', 7)).to.equal(7);
    expect(get(NaN, Date.now())).to.equal(undefined);
    expect(get('', 'c.b', false)).to.equal(false);
    expect(get(false, 87, 'something')).to.equal('something');
  });
});
