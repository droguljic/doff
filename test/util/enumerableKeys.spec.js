// Load modules

const expect = require('chai').expect;

const enumerableKeys = require('../../lib/util/enumerableKeys');

// Describe test cases

describe('util/enumerableKeys', () => {
  it('Returns enumerable string keys', () => {
    const object = {
      key: 'is',
      only: 'this',
      [Symbol('???')]: '!!!'
    };

    expect(enumerableKeys(object)).to.deep.equal(['key', 'only']);
  });

  it('Returns enumerable string and symbol keys', () => {
    const symbol = Symbol('how');
    const object = {
      key: 'is',
      only: 'this',
      [symbol]: 'to'
    };

    expect(enumerableKeys(object, true)).to.deep.equal(['key', 'only', symbol]);
  });

  it('Returns empty array for unsupported type', () => {
    /* eslint-disable no-unused-expressions */
    expect(enumerableKeys(undefined)).to.be.an('array').that.is.empty;
    expect(enumerableKeys(null)).to.be.an('array').that.is.empty;
    expect(enumerableKeys(91)).to.be.an('array').that.is.empty;
    expect(enumerableKeys(true)).to.be.an('array').that.is.empty;
    expect(enumerableKeys(() => {})).to.be.an('array').that.is.empty;
    /* eslint-enable no-unused-expressions */
  });
});
