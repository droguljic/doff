// Load modules

const expect = require('chai').expect;

const LocalPath = require('../../lib/util/LocalPath');

// Describe test cases

describe('util/LocalPath', () => {
  it('Creates a local path', () => {
    const path = new LocalPath();
    expect(path).to.be.an('localpath');
    expect(path).to.have.own.property('asString').and.to.be.an('string');
    expect(path).to.have.own.property('asArray').and.to.be.an('array');
    expect(path).to.have.property('isEmpty').and.to.be.an('function');
  });

  it('Identifies a valid local path', () => {
    expect(LocalPath.isInstance(new LocalPath())).to.equal(true);
    expect(LocalPath.isInstance(undefined)).to.equal(false);
    expect(LocalPath.isInstance(null)).to.equal(false);
    expect(LocalPath.isInstance(true)).to.equal(false);
    expect(LocalPath.isInstance(17)).to.equal(false);
    expect(LocalPath.isInstance('why?')).to.equal(false);
    expect(LocalPath.isInstance(() => {})).to.equal(false);
    expect(LocalPath.isInstance([])).to.equal(false);
    expect(LocalPath.isInstance(Object.create(null))).to.equal(false);
    expect(LocalPath.isInstance({ asString: '', asArray: [] })).to.equal(false);
  });

  it('Identifies a empty local path', () => {
    const path = new LocalPath();
    expect(path.isEmpty()).to.equal(true);

    path.asString = 'try.now';
    path.asArray = ['try', 'now'];
    expect(path.isEmpty()).to.equal(false);
  });

  it('Uses base, if appropriate', () => {
    const base = new LocalPath();
    base.asString = 'foundation.is.the.key';
    base.asArray = ['foundation', 'is', 'the', 'key'];

    const on = new LocalPath();
    on.asString = 'to.a[7]';
    on.asArray = ['to', 'a', 7];

    const top = new LocalPath();
    top.asString = 'things';
    top.asArray = ['things'];

    const path = new LocalPath();
    expect(
      path
        .use(base)
        .use({ cause: 'this cannot work!' })
        .use(on)
        .use(top)
    ).to.equal(path);
    expect(path.asString).to.equal('foundation.is.the.key.to.a[7]things');
    expect(path.asArray).to.deep.equal(['foundation', 'is', 'the', 'key', 'to', 'a', 7, 'things']);
  });

  it('Appends correctly', () => {
    const it = Symbol('it');
    const path = new LocalPath();
    expect(
      path
        .append('lets')
        .append('[0]', 0)
        .append('chain')
        .append('[1]', 1)
        .append('@@it', it)
    ).to.equal(path);
    expect(path.asString).to.equal('lets[0].chain[1].@@it');
    expect(path.asArray).to.deep.equal(['lets', 0, 'chain', 1, it]);
  });
});
