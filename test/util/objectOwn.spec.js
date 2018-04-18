// Load modules

const expect = require('chai').expect;

const objectOwn = require('../../lib/util/objectOwn');

// Describe test cases

describe('util/objectOwn', () => {
  it('Iterates over object own properties', () => {
    const foo = { key: 'value', number: 17, bool: true };
    objectOwn(foo, (value, key, object) => {
      expect(object).to.equal(foo);
      expect(foo).to.have.own.property(key, value);
    });
  });

  it('Exits loop when iteratee returns `false`', () => {
    const foo = { key: 'value', number: 17, bool: true };
    const accumulator = [];
    objectOwn(foo, (value) => {
      if (typeof value === 'boolean') {
        return false;
      }

      accumulator.push(value);
    });

    expect(accumulator).to.deep.equal(['value', 17]);
  });
});
