// Load modules

const expect = require('chai').expect;

const Default = require('../../lib/options/Default');

// Internal logic

const DEFAULT_KEYS = [
  'isolate',
  'mutate',
  'depth',
  'symbols',
  'fallthrough',
  'preserve',
  'reference',
  'wipe',
  'blur',
  'use'
];

function Override() {
  this.mutate = true;
  this.fallthrough = true;
}

// Describe test cases

describe('options/Default', () => {
  after(() => { // Revert to original state
    Default.use({ isolate: false, symbols: false, reference: undefined, blur: { paths: undefined } });
  });

  it('Has appropriate properties with corresponding values', () => {
    expect(Default).to.have.all.keys(DEFAULT_KEYS);
    expect(Default).to.have.own.property('isolate', false);
    expect(Default).to.have.own.property('mutate', false);
    expect(Default).to.have.own.property('depth', 0);
    expect(Default).to.have.own.property('symbols', false);
    expect(Default).to.have.own.property('fallthrough', false);
    expect(Default).to.have.deep.own.property('preserve', {
      arrays: false,
      objects: false,
      paths: undefined,
      types: ['[object Date]', '[object RegExp]']
    });
    expect(Default).to.have.own.property('reference', undefined);
    expect(Default).to.have.own.property('wipe', false);
    expect(Default).to.have.deep.own.property('blur', {
      paths: undefined,
      mask: '*******'
    });
    expect(Default).to.have.deep.own.property('use').and.to.be.a('function');
  });

  it('Overrides default with use', () => {
    Default.use({ isolate: true, symbols: true, reference: {}, blur: { paths: 'which.one' } });
    expect(Default).to.have.own.property('isolate', true);
    expect(Default).to.have.own.property('mutate', false);
    expect(Default).to.have.own.property('depth', 0);
    expect(Default).to.have.own.property('symbols', true);
    expect(Default).to.have.own.property('fallthrough', false);
    expect(Default).to.have.deep.own.property('preserve', {
      arrays: false,
      objects: false,
      paths: undefined,
      types: ['[object Date]', '[object RegExp]']
    });
    expect(Default).to.have.deep.own.property('reference', {});
    expect(Default).to.have.own.property('wipe', false);
    expect(Default).to.have.deep.own.property('blur', {
      paths: 'which.one',
      mask: '*******'
    });
    expect(Default).to.have.deep.own.property('use').and.to.be.a('function');
  });

  it('Ignores invalid override', () => {
    Default.use(undefined);
    Default.use(null);
    Default.use(false);
    Default.use([]);
    Default.use(new Override());
    expect(Default).to.have.own.property('isolate', true);
    expect(Default).to.have.own.property('mutate', false);
    expect(Default).to.have.own.property('depth', 0);
    expect(Default).to.have.own.property('symbols', true);
    expect(Default).to.have.own.property('fallthrough', false);
    expect(Default).to.have.deep.own.property('preserve', {
      arrays: false,
      objects: false,
      paths: undefined,
      types: ['[object Date]', '[object RegExp]']
    });
    expect(Default).to.have.deep.own.property('reference', {});
    expect(Default).to.have.own.property('wipe', false);
    expect(Default).to.have.deep.own.property('blur', {
      paths: 'which.one',
      mask: '*******'
    });
    expect(Default).to.have.deep.own.property('use').and.to.be.a('function');
  });
});
