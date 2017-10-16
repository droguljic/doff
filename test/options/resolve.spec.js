// Load modules

const expect = require('chai').expect;

const resolve = require('../../lib/options/resolve');

// Internal logic

const instructions = {
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
  it('Should resolve instructions correctly', () => {
    const options = resolve(instructions);
    expect(options).to.have.own.property('isolate', instructions.isolate);
    expect(options).to.have.own.property('original', instructions.original);
    expect(options).to.have.own.property('depth', instructions.depth);
    expect(options).to.have.own.property('fallthrough', instructions.fallthrough);
    expect(options).to.have.own.property('preserve').and.to.be.a('function');
    expect(options).to.have.own.property('reference', instructions.reference);
    expect(options).to.have.own.property('wipe').and.to.be.a('function');
    expect(options).to.have.own.property('blur').and.to.be.a('function');
  });

  it('Should resolve unsupported instructions as empty object', () => {
    expect(resolve(undefined)).to.be.empty.and.to.be.an('object');
    expect(resolve(null)).to.be.empty.and.to.be.an('object');
    expect(resolve(19)).to.be.empty.and.to.be.an('object');
    expect(resolve('correct')).to.be.empty.and.to.be.an('object');
    expect(resolve([])).to.be.empty.and.to.be.an('object');
    expect(resolve(new Map())).to.be.empty.and.to.be.an('object');
    expect(resolve(new Set())).to.be.empty.and.to.be.an('object');
    expect(resolve(new Date())).to.be.empty.and.to.be.an('object');
    expect(resolve(() => {})).to.be.empty.and.to.be.an('object');
  });
});
