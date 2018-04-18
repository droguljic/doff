// Load modules

const expect = require('chai').expect;
const rewire = require('rewire');

const resolve = rewire('../../lib/options/resolve');

// Internal logic

const defaults = resolve.__get__('DEFAULT_INSTRUCTIONS');

const options = {
  isolate: false,
  original: false,
  depth: 0,
  fallthrough: true,
  preserve: {
    arrays: false,
    objects: false,
    paths: undefined,
    types: ['[object Map]', '[object Set]']
  },
  reference: {
    good: 'path'
  },
  wipe: true,
  blur: {
    paths: undefined,
    mask: '*******'
  }
};

// Describe test cases

describe('options/resolve', () => {
  it('Resolves options', () => {
    const instructions = resolve(options);
    expect(instructions).to.have.own.property('isolate', options.isolate);
    expect(instructions).to.have.own.property('original', options.original);
    expect(instructions).to.have.own.property('depth', options.depth);
    expect(instructions).to.have.own.property('fallthrough', options.fallthrough);
    expect(instructions).to.have.own.property('preserve').and.to.be.a('function');
    expect(instructions).to.have.own.property('reference', options.reference);
    expect(instructions).to.have.own.property('wipe').and.to.be.a('function');
    expect(instructions).to.have.own.property('blur').and.to.be.a('function');
  });

  it('Resolves missing wipe or blur using defaults', () => {
    expect(resolve({ wipe: true })).to.have.keys('wipe', 'blur').and.to.have.own.property('blur', defaults.blur);
    const blur = { paths: 'blurry.thing', mask: '|||||||||' };
    expect(resolve({ blur })).to.have.keys('wipe', 'blur').and.to.have.own.property('wipe', defaults.wipe);
  });

  it('Resolves empty options using defaults', () => {
    expect(resolve({})).to.deep.equal(defaults);
    expect(resolve({ isolate: true })).to.deep.equal(Object.assign({ isolate: true }, defaults));
  });

  it('Resolves non-options using defaults', () => {
    expect(resolve(undefined)).to.equal(defaults);
    expect(resolve(null)).to.equal(defaults);
    expect(resolve(19)).to.equal(defaults);
    expect(resolve('correct')).to.equal(defaults);
    expect(resolve([])).to.equal(defaults);
    expect(resolve(new Map())).to.equal(defaults);
    expect(resolve(new Set())).to.equal(defaults);
    expect(resolve(new Date())).to.equal(defaults);
    expect(resolve(() => {})).to.equal(defaults);
  });
});
