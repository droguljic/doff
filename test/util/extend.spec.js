// Load modules

const expect = require('chai').expect;

const extend = require('../../lib/util/extend');

// Internal logic

function Point(x, y) {
  this.x = x;
  this.y = y;
}

Point.prototype.print = function() {
  return `${this.x}, ${this.y}`;
};

Point.prototype.ZERO = '0, 0';

// Describe test cases

describe('util/extend', () => {
  it('Extends target', () => {
    const target = { key: 'value' };
    const context = new Point(47, 91);
    const output = extend(target, Point.prototype, context);

    expect(target).to.equal(output);
    expect(output).to.have.own.property('key', 'value');
    expect(output).to.have.own.property('ZERO', '0, 0');
    expect(output).to.have.own.property('print');
    expect(output.print()).to.equal('47, 91');
  });
});
