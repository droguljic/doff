// Load modules

const expect = require('chai').expect;

const isPath = require('../../lib/util/isPath');
const LocalPath = require('../../lib/util/LocalPath');

// Describe test cases

describe('util/isPath', () => {
  it('Identifies path like values', () => {
    expect(isPath(new LocalPath())).to.equal(true);
    expect(isPath(new LocalPath().append('walk').append('it').append('[7]', 7))).to.equal(true);
    expect(isPath(0)).to.equal(true);
    expect(isPath(117)).to.equal(true);
    expect(isPath('awesome-hiking')).to.equal(true);
    expect(isPath(Symbol('dive'))).to.equal(true);
  });

  it('Identifies non array like values', () => {
    expect(isPath(undefined)).to.equal(false);
    expect(isPath(null)).to.equal(false);
    expect(isPath(-3)).to.equal(false);
    expect(isPath(true)).to.equal(false);
    expect(isPath({})).to.equal(false);
    expect(isPath([])).to.equal(false);
    expect(isPath(() => {})).to.equal(false);
  });
});
