// Load modules

const expect = require('chai').expect;

const bind = require('../../lib/util/bind');

// Internal logic

function Bar(one, four) {
  this.one = one;
  this.four = four;
  this.seven = 3;
}

Bar.prototype.foo = function() {
  this.seven = 21;
  return this.one + this.four;
};

// Describe test cases

describe('util/bind', () => {
  it('Should bind context', () => {
    const bar = new Bar(5, 9);
    const foo = bind(Bar.prototype.foo, bar);
    expect(foo()).to.equal(14);
    expect(bar.seven).to.equal(21);
  });
});
