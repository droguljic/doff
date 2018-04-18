// Load modules

const expect = require('chai').expect;

const LocalPath = require('../../lib/util/LocalPath');
const toProperty = require('../../lib/util/toProperty');
const toString = require('../../lib/util/toString');

// Internal logic

const symbol = Symbol('property');
const path = new LocalPath().append('yet').append('another').append('property');

// Describe test cases

describe('util/toProperty', () => {
  it('Converts value to property', () => {
    expect(toProperty('one.nice.property')).to.equal('one.nice.property');
    expect(toProperty(symbol)).to.equal(symbol);
    expect(toProperty(7)).to.equal(7);
    expect(toProperty(path)).to.equal(path.asString);
    expect(toProperty(true)).to.equal(toString(true));
    expect(toProperty([11, 15])).to.equal(toString([11, 15]));
    expect(toProperty({ how: { about: 'this' } })).to.equal(toString({ how: { about: 'this' } }));
  });
});
