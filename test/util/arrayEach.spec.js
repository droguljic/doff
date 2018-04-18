// Load modules

const expect = require('chai').expect;

const arrayEach = require('../../lib/util/arrayEach');

// Describe test cases

describe('util/arrayEach', () => {
  it('Iterates over array elements', () => {
    const numbers = [1, 3, 5, 7, 9];
    const order = [];
    arrayEach(numbers, (value, index, array) => {
      order.push(index);
      expect(array).to.equal(numbers);
      expect(array).to.have.own.property(index, value);
    });
    expect(order).to.deep.equal([0, 1, 2, 3, 4]);
  });

  it('Exits loop when iteratee returns false', () => {
    const numbers = [3, 9, 11];
    const accumulator = [];
    arrayEach(numbers, (value) => {
      if (value % 3 !== 0) {
        return false;
      }

      accumulator.push(value);
    });

    expect(accumulator).to.deep.equal([3, 9]);
  });
});
