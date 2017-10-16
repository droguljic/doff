// Load modules

const expect = require('chai').expect;
const spy = require('sinon').spy;

const get = require('../../lib/util/get');
const preserve = require('../../lib/options/preserve');
const LocalPath = require('../../lib/util/LocalPath');

// Internal logic

const target = {
  yes: [],
  is: { also: {} },
  a: 'very',
  interesting: { word: new Set() }
};

// Describe test cases

describe('options/preserve', () => {
  it('Should preserve arrays', () => {
    const path = new LocalPath().append('yes');
    const options = { arrays: true };
    expect(preserve(get(target, path), path, options)).to.equal(true);
  });

  it('Should preserve objects', () => {
    const path = new LocalPath().append('is').append('also');
    const options = { objects: true };
    expect(preserve(get(target, path), path, options)).to.equal(true);
  });

  it('Should preserve paths', () => {
    const path = new LocalPath().append('a');
    const options = { paths: ['a'] };
    expect(preserve(get(target, path), path, options)).to.equal(true);
  });

  it('Should preserve types', () => {
    const path = new LocalPath().append('interesting').append('word');
    const options = { types: [Set] };
    expect(preserve(get(target, path), path, options)).to.equal(true);
  });

  describe('options/preserve.resolve', () => {
    const emptyValue = '';
    const emptyPath = new LocalPath();
    let preserveSpy;
    beforeEach(() => (preserveSpy = spy(preserve, 'preserve')));
    afterEach(() => preserveSpy.restore());

    it('Should resolve using single paths and types options', () => {
      const options = { arrays: true, objects: false, paths: 'is.also', types: Map };
      const resolved = preserve.resolve(options);
      expect(resolved).to.be.a('function').and.to.have.property('length', 2);
      resolved(emptyValue, emptyPath);
      expect(preserveSpy.args[0][0]).to.equal(emptyValue);
      expect(preserveSpy.args[0][1]).to.equal(emptyPath);
      expect(preserveSpy.args[0][2]).to.deep.equal(
        { arrays: true, objects: false, paths: ['is.also'], types: [Map] }
      );
    });

    it('Should resolve using array paths and types options', () => {
      const options = { arrays: false, objects: true, paths: ['is.also'], types: [Map] };
      const resolved = preserve.resolve(options);
      expect(resolved).to.be.a('function').and.to.have.property('length', 2);
      resolved(emptyValue, emptyPath);
      expect(preserveSpy.args[0][0]).to.equal(emptyValue);
      expect(preserveSpy.args[0][1]).to.equal(emptyPath);
      expect(preserveSpy.args[0][2]).to.deep.equal(options);
    });

    it('Should resolve using unsupported paths and types options', () => {
      const options = { arrays: true, objects: true, paths: 17, types: null };
      const resolved = preserve.resolve(options);
      expect(resolved).to.be.a('function').and.to.have.property('length', 2);
      resolved(emptyValue, emptyPath);
      expect(preserveSpy.args[0][0]).to.equal(emptyValue);
      expect(preserveSpy.args[0][1]).to.equal(emptyPath);
      expect(preserveSpy.args[0][2]).to.deep.equal({ arrays: true, objects: true, paths: [], types: [] });
    });
  });
});
