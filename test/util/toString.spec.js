// Load modules

const expect = require('chai').expect;

const toString = require('../../lib/util/toString');

// Describe test cases

describe('util/toString', () => {
  it('Should convert value to string', () => {
    expect(toString(undefined)).to.equal('');
    expect(toString(null)).to.equal('');
    expect(toString(false)).to.equal('false');
    expect(toString(9)).to.equal('9');
    expect(toString('original')).to.equal('original');
    expect(toString(Symbol('awesome'))).to.equal('@@awesome');
    expect(toString([1, 1])).to.equal(`${[1, 1]}`);
    expect(toString({ key: 'value' })).to.equal(`${{ key: 'value' }}`);
  });
});
