// Load modules

const expect = require('chai').expect;

const arrayEachRight = require('../../lib/util/arrayEachRight');

// Describe test cases

describe('util/arrayEachRight', () => {
  it('Should iterate over array elements in reverse order', () => {
    const numbers = [1, 3, 5, 7, 9];
    const order = [];
    arrayEachRight(numbers, (value, index, array) => {
      order.push(index);
      expect(array).to.equal(numbers);
      expect(array).to.have.own.property(index, value);
    });
    expect(order).to.deep.equal([4, 3, 2, 1, 0]);
  });

  it('Should exit loop when iteratee returns false', () => {
    const numbers = [3, 9, 11];
    const accumulator = [];
    arrayEachRight(numbers, (value) => {
      if (value % 3 !== 0) {
        return false;
      }

      accumulator.push(value);
    });

    expect(accumulator).to.deep.equal([]);
  });
});
