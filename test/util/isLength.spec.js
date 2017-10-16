// Load modules

const expect = require('chai').expect;

const isLength = require('../../lib/util/isLength');

// Describe test cases

describe('util/isLength', () => {
  it('Should identify length values', () => {
    expect(isLength(0)).to.equal(true);
    expect(isLength(11)).to.equal(true);
    expect(isLength(91)).to.equal(true);
    expect(isLength(1371)).to.equal(true);
  });

  it('Should identify non length values', () => {
    expect(isLength(undefined)).to.equal(false);
    expect(isLength(null)).to.equal(false);
    expect(isLength(-3)).to.equal(false);
    expect(isLength(-17)).to.equal(false);
    expect(isLength(true)).to.equal(false);
    expect(isLength({})).to.equal(false);
    expect(isLength([])).to.equal(false);
  });
});
