// Load modules

const expect = require('chai').expect;

const clone = require('../../lib/util/clone');

// Internal logic

function Foo() {
  this.one = 'more time';
  this.has = 17;
}

const target = {
  unique: new Set([7777777]),
  simple: 'string',
  sequenece: [null, Symbol('agree'), { what: 'now?' }],
  foo: new Foo(),
  mapping: new Map([['key', 'value']]),
  deep: { to: { core: '' } },
  state: false,
  time: new Date(),
  test: /[very]/,
  complicated: undefined
};

// Describe test cases

describe('util/clone', () => {
  it('Clones provided value', () => {
    const output = clone(target);
    expect(output).to.not.equal(target);
    expect(output).to.deep.equal(target);
    expect(output.unique).to.not.equal(target.unique);
    expect(output.simple).to.equal(target.simple);
    expect(output.sequenece).to.not.equal(target.sequenece);
    expect(output.sequenece[0]).to.equal(target.sequenece[0]);
    expect(output.sequenece[1]).to.equal(target.sequenece[1]);
    expect(output.sequenece[2]).to.not.equal(target.sequenece[2]);
    expect(output.foo).to.not.equal(target.foo);
    expect(output.foo.one).to.equal(target.foo.one);
    expect(output.foo.has).to.equal(target.foo.has);
    expect(output.deep).to.not.equal(target.deep);
    expect(output.deep.to).to.not.equal(target.deep.to);
    expect(output.deep.to.core).to.equal(target.deep.to.core);
    expect(output.state).to.equal(target.state);
    expect(output.time).to.not.equal(target.time);
    expect(output.test).to.not.equal(target.test);
    expect(output.complicated).to.equal(target.complicated);
  });
});
