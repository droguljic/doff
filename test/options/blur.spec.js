// Load modules

const expect = require('chai').expect;
const spy = require('sinon').spy;

const blur = require('../../lib/options/blur');
const get = require('../../lib/util/get');
const LocalPath = require('../../lib/util/LocalPath');

// Internal logic

const protect = Symbol('protect');
const object = {
  top: 'secret',
  sealed: 'forever',
  hide: {
    me: {
      very: 'deep'
    }
  },
  extra: {
    sensitive: 'information'
  },
  keep: {
    it: 'under the radar'
  },
  we: {
    must: {
      [protect]: [{ our: 'thing' }]
    }
  },
  open: {
    to: 'everyone'
  },
  nothing: 'to hide'
};

// Describe test cases

describe('options/blur', () => {
  it('Blurs a single path using the default mask', () => {
    const path = new LocalPath().append('top');
    const options = { paths: 'top', mask: '???' };
    expect(blur(get(object, path), path, object, options)).to.equal(options.mask);
  });

  it('Blurs a single path using the provided mask', () => {
    const path = new LocalPath().append('sealed');
    const options = { paths: { sealed: '!!!' } };
    expect(blur(get(object, path), path, object, options)).to.equal(options.paths.sealed);
  });

  it('Blurs an array of paths using the default and provided masks', () => {
    let path = new LocalPath().append('hide').append('me').append('very');
    const options = { paths: [{ 'hide.me.very': '***' }, 'extra.sensitive'], mask: ':::' };
    expect(blur(get(object, path), path, object, options)).to.equal(options.paths[0]['hide.me.very']);

    path = new LocalPath().append('extra').append('sensitive');
    expect(blur(get(object, path), path, object, options)).to.equal(options.mask);
  });

  it('Blurs a paths using the custom function', () => {
    const path = new LocalPath().append('keep').append('it');
    const options = { paths: () => '___' };
    expect(blur(get(object, path), path, object, options)).to.equal(options.paths());
  });

  it('Ignores an unaffected paths', () => {
    let path = new LocalPath().append('open').append('to');
    let value = get(object, path);
    const options = { paths: ['top', 'hide.me.very'], mask: ',,,' };
    expect(blur(value, path, object, options)).to.equal(value);

    path = new LocalPath().append('nothing');
    value = get(object, path);
    expect(blur(value, path, object, options)).to.equal(value);
  });

  it('Returns the value if options are not provided', () => {
    const path = new LocalPath().append('extra').append('sensitive');
    const value = get(object, path);
    expect(blur(value, path, object)).to.equal(value);
  });

  describe('options/blur.resolve', () => {
    let blurSpy;
    beforeEach(() => (blurSpy = spy(blur, 'blur')));
    afterEach(() => blurSpy.restore());

    it('Resolves using options', () => {
      const value = undefined;
      const path = new LocalPath();
      const options = {};
      const resolved = blur.resolve(options);
      expect(resolved).to.be.a('function').and.to.have.property('length', 3);
      resolved(value, path, object);
      expect(blurSpy.args[0][0]).to.equal(value);
      expect(blurSpy.args[0][1]).to.equal(path);
      expect(blurSpy.args[0][2]).to.equal(object);
      expect(blurSpy.args[0][3]).to.equal(options);
    });
  });
});
