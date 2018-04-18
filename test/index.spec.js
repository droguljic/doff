// Load modules

const expect = require('chai').expect;

const lib = require('../lib');
const Options = require('../lib/options');
const Util = require('../lib/util');

// Describe test cases

describe('index', () => {
  it('Exports the appropriate instance', () => {
    expect(lib).to.be.a('function');
    expect(lib).to.have.own.property('getOptions').and.to.be.a('function');
    expect(lib.getOptions()).to.equal(Options.Default);
    expect(lib).to.have.own.property('aim').and.to.be.a('function');
    expect(lib).to.have.own.property('options', undefined);
    expect(lib).to.have.own.property('use').and.to.be.a('function');
    expect(lib).to.have.own.property('create').and.to.be.a('function');
  });

  it('Overrides default properties and return the instance', () => {
    const options = { symbols: true, reference: { how: { about: 'now' } } };
    const finalOptions = Util.merge.with({ atomic: { keys: ['reference'] } }).exec({}, Options.Default, options);
    const instance = lib.use(options);
    expect(instance).to.equal(lib);
    expect(instance.getOptions()).to.deep.equal(finalOptions);
    expect(finalOptions).to.deep.equal(Options.Default);
    lib.use({ symbols: false, reference: undefined }); // Restore the default options
  });

  it('Creates a custom instance', () => {
    const options = { mutate: true, wipe: () => true };
    const instance = lib.create(options);
    const finalOptions = Util.merge({}, Options.Default, options);
    expect(instance).to.be.a('function');
    expect(instance).to.have.own.property('getOptions').and.to.be.a('function');
    expect(instance.getOptions()).to.deep.equal(finalOptions);
    expect(instance).to.have.own.property('aim').and.to.be.a('function');
    expect(instance).to.have.deep.own.property('options', finalOptions);
    expect(instance).to.not.have.own.property('use').and.to.be.a('function');
    expect(instance).to.not.have.own.property('create').and.to.be.a('function');
  });

  it('Creates a custom instance with isolated options', () => {
    const options = { isolate: true, wipe: null, blur: () => '???????????' };
    const instance = lib.create(options);
    expect(instance).to.be.a('function');
    expect(instance).to.have.own.property('getOptions').and.to.be.a('function');
    expect(instance.getOptions()).to.deep.equal(options);
    expect(instance).to.have.own.property('aim').and.to.be.a('function');
    expect(instance).to.have.deep.own.property('options', options);
    expect(instance).to.not.have.own.property('use').and.to.be.a('function');
    expect(instance).to.not.have.own.property('create').and.to.be.a('function');
  });
});
