// Load modules

const expect = require('chai').expect;

const LocalPath = require('../../lib/util/LocalPath');
const toLocalPath = require('../../lib/util/toLocalPath');

// Describe test cases

describe('util/toLocalPath', () => {
  it('Resolves fraction without base', () => {
    let path = toLocalPath('first');
    expect(path.asString).to.equal('first');
    expect(path.asArray).to.deep.equal(['first']);

    const second = Symbol('second');
    path = toLocalPath(second, undefined, {});
    expect(path.asString).to.equal('@@second');
    expect(path.asArray).to.deep.equal([second]);

    path = toLocalPath(3, undefined, []);
    expect(path.asString).to.equal('[3]');
    expect(path.asArray).to.deep.equal([3]);
  });

  it('Resolves fraction with base', () => {
    const firstBase = toLocalPath('first');
    const second = Symbol('second');
    const secondBase = toLocalPath(second, firstBase);
    const path = toLocalPath(3, secondBase, []);

    expect(path.asString).to.equal('first.@@second[3]');
    expect(path.asArray).to.deep.equal(['first', second, 3]);
  });

  it('Resolves fraction that is a path by returning it', () => {
    const path = toLocalPath('super', new LocalPath().append('zero'));
    expect(toLocalPath(path)).to.equal(path);
  });

  it('Resolves unsupported fraction types as empty path', () => {
    expect(toLocalPath().isEmpty()).to.equal(true);
    expect(toLocalPath(null).isEmpty()).to.equal(true);
    expect(toLocalPath(false).isEmpty()).to.equal(true);
    expect(toLocalPath({}).isEmpty()).to.equal(true);
    expect(toLocalPath([]).isEmpty()).to.equal(true);
    expect(toLocalPath(() => {}).isEmpty()).to.equal(true);
  });
});
