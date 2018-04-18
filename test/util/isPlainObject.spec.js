// Load modules

const expect = require('chai').expect;

const isPlainObject = require('../../lib/util/isPlainObject');

// Internal logic

function Instance() {}

// Describe test cases

describe('util/isPlainObject', () => {
  it('Identifies plain objects', () => {
    expect(isPlainObject({})).to.equal(true);
    expect(isPlainObject({ simple: 7 })).to.equal(true);
    expect(isPlainObject(Object.create(null))).to.equal(true);
  });

  it('Identifies non objects', () => {
    expect(isPlainObject(undefined)).to.equal(false);
    expect(isPlainObject(null)).to.equal(false);
    expect(isPlainObject(false)).to.equal(false);
    expect(isPlainObject(3)).to.equal(false);
    expect(isPlainObject('yes')).to.equal(false);
    expect(isPlainObject([])).to.equal(false);
    expect(isPlainObject(new Date())).to.equal(false);
    expect(isPlainObject(new Instance())).to.equal(false);
    expect(isPlainObject(Object.create({ cool: 'new prototype' }))).to.equal(false);
  });
});
