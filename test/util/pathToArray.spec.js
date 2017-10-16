// Load modules

const expect = require('chai').expect;

const LocalPath = require('../../lib/util/LocalPath');
const pathToArray = require('../../lib/util/pathToArray');

// Describe test cases

describe('util/pathToArray', () => {
  it('Should convert string path to an array', () => {
    const objectPath = 'start.of.the.awesome.path';
    const arrayPath = '[1][17][3][9][45]';
    const mixedPath = 'try.to[1].mix[7].this';
    expect(pathToArray(objectPath)).to.deep.equal(['start', 'of', 'the', 'awesome', 'path']);
    expect(pathToArray(arrayPath)).to.deep.equal(['1', '17', '3', '9', '45']);
    expect(pathToArray(mixedPath)).to.deep.equal(['try', 'to', '1', 'mix', '7', 'this']);
  });

  it('Should convert symbol path to an array', () => {
    const symbolPath = Symbol('path');
    expect(pathToArray(symbolPath)).to.deep.equal([symbolPath]);
  });

  it('Should convert length path to an array', () => {
    const lengthPath = 91;
    expect(pathToArray(lengthPath)).to.deep.equal([lengthPath]);
  });

  it('Should return an asArray property if a path is the LocalPath', () => {
    const path = new LocalPath().append('cool').append('path');
    expect(pathToArray(path)).to.equal(path.asArray);
  });

  it('Should return empty array if argument is not a path', () => {
    /* eslint-disable no-unused-expressions */
    expect(pathToArray(undefined)).to.be.an('array').that.is.empty;
    expect(pathToArray(null)).to.be.an('array').that.is.empty;
    expect(pathToArray(true)).to.be.an('array').that.is.empty;
    expect(pathToArray(-21)).to.be.an('array').that.is.empty;
    expect(pathToArray([])).to.be.an('array').that.is.empty;
    expect(pathToArray({})).to.be.an('array').that.is.empty;
    expect(pathToArray(() => {})).to.be.an('array').that.is.empty;
    /* eslint-enable no-unused-expressions */
  });
});
