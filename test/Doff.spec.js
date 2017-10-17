// Load modules

const expect = require('chai').expect;
const rewire = require('rewire');
const spy = require('sinon').spy;

const Doff = rewire('../lib/Doff');
const Options = require('../lib/options');

// Describe test cases

describe('Doff', () => {
  it('Should export the appropriate structure', () => {
    expect(Doff).to.be.a('function');
    expect(Doff.prototype).to.have.own.property('getOptions').and.to.be.a('function');
    expect(Doff.prototype.getOptions.length).to.equal(0);
    expect(Doff.prototype).to.have.own.property('aim').and.to.be.a('function');
    expect(Doff.prototype.aim.length).to.equal(1);
  });

  it('Should create an instance without options and use defaults', () => {
    const doff = new Doff();
    expect(doff).to.have.own.property('options', undefined);
    expect(doff.getOptions()).to.equal(Options.Default);
  });

  it('Should create an instance with provided options and use them', () => {
    const options = { mutate: true, depth: 7 };
    const doff = new Doff(options);
    expect(doff).to.have.own.property('options', options);
    expect(doff.getOptions()).to.equal(options);
  });

  it('Should only use options provided to the aim when isolate option is true', () => {
    const resolveSpy = spy(Doff.__get__('Options'), 'resolve');
    new Doff().aim({}, { isolate: true });
    resolveSpy.restore();
    expect(resolveSpy.args.length).to.equal(1);
    expect(resolveSpy.args[0][0]).to.deep.equal({ isolate: true });
  });

  it('Should process the target', () => {
    const object = {
      hey: 'do not remove this',
      but: { you: { can: { remove: { [Symbol('that')]: null } } } },
      on: true,
      off: false,
      big: { number: 0 },
      sequence: [NaN, '', 17, { good: 'job' }],
      nothing: new Map()
    };
    expect(new Doff().aim(object)).to.deep.equal({
      hey: 'do not remove this',
      on: true,
      off: false,
      big: { number: 0 },
      sequence: [17, { good: 'job' }]
    });
  });

  it('Should accumulate the target when provided options are empty', () => {
    const array = [
      17,
      false,
      undefined,
      {
        go: {
          to: {
            the: {
              end: undefined
            }
          }
        }
      },
      new Date(),
      {
        plain: null,
        simple: NaN
      },
      new Set(['lets', 11, true])
    ];

    const output = new Doff().aim(array, { isolate: true });
    expect(output).to.not.equal(array);
    expect(output[3]).to.not.equal(array[3]);
    expect(output[4]).to.equal(array[4]);
    expect(output[5]).to.not.equal(array[5]);
    expect(output[6]).to.equal(array[6]);
    expect(output).to.deep.equal(array);
  });

  it('Should respect the mutate option', () => {
    const object = {
      one: { that: 'remains' },
      entries: [undefined, 19, 'something', true, null, 0, { good: 'one' }],
      hide: 'this one',
      not: false,
      or: ''
    };
    const output = new Doff().aim(object, { mutate: true, blur: { paths: 'hide' } });
    expect(output).to.equal(object);
    expect(output).to.deep.equal({
      one: { that: 'remains' },
      entries: [19, 'something', true, 0, { good: 'one' }],
      hide: Options.Default.blur.mask,
      not: false
    });
  });

  it('Should respect the fallthrough option', () => {
    const array = [{ simple: { as: {} } }];
    const wipe = spy();
    new Doff().aim(array, { fallthrough: true, preserve: { objects: true }, wipe });
    expect(wipe.args.length).to.equal(1);
    expect(wipe.args[0][0]).to.deep.equal(array[0]);
    expect(wipe.args[0][1].asString).to.equal('[0]');
    expect(wipe.args[0][2]).to.equal(array);
  });

  it('Should respect the reference option', () => {
    const object = {
      bye: { bye: null },
      not: { going: { anywhere: null } }
    };
    const reference = { not: { going: { anywhere: null } } };
    const output = new Doff().aim(object, { reference });
    expect(output).to.deep.equal(reference);
  });
});
