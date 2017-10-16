// Load modules

const expect = require('chai').expect;

const Wipe = require('../../lib/options/Wipe');

// Internal logic

const nonEnumerableObject = Object.defineProperty({}, 'non', { value: 'secret' });
const symbolObject = { [Symbol('sym')]: 17 };

// Describe test cases

describe('options/Wipe', () => {
  it('Should always return false in the case of skip', () => {
    expect(Wipe.skip(undefined)).to.equal(false);
    expect(Wipe.skip(null)).to.equal(false);
    expect(Wipe.skip(NaN)).to.equal(false);
    expect(Wipe.skip(false)).to.equal(false);
    expect(Wipe.skip(0)).to.equal(false);
    expect(Wipe.skip(7)).to.equal(false);
    expect(Wipe.skip('')).to.equal(false);
    expect(Wipe.skip('bar')).to.equal(false);
    expect(Wipe.skip([])).to.equal(false);
    expect(Wipe.skip({})).to.equal(false);
    expect(Wipe.skip(() => {})).to.equal(false);
    expect(Wipe.skip(new Set())).to.equal(false);
    expect(Wipe.skip(new Map())).to.equal(false);
    expect(Wipe.skip(new Date())).to.equal(false);
    expect(Wipe.skip(new RegExp('test'))).to.equal(false);
  });

  it('Should resolve the string and boolean aliases', () => {
    expect(Wipe.resolve('falsy.relaxed')).to.equal(Wipe.falsy.relaxed);
    expect(Wipe.resolve('falsy.strict')).to.equal(Wipe.falsy.strict);
    expect(Wipe.resolve('empty.loose')).to.equal(Wipe.empty.loose);
    expect(Wipe.resolve('empty.relaxed')).to.equal(Wipe.empty.relaxed);
    expect(Wipe.resolve(false)).to.equal(Wipe.empty.relaxed);
    expect(Wipe.resolve('empty.strict')).to.equal(Wipe.empty.strict);
    expect(Wipe.resolve(true)).to.equal(Wipe.empty.strict);
  });

  it('Should resolve the function with itself', () => {
    const arrow = () => {};
    expect(Wipe.resolve(arrow)).to.equal(arrow);
  });

  it('Should resolve the array with function calling includes on the array', () => {
    const array = ['how', 17];
    const wipe = Wipe.resolve(array);
    expect(wipe).to.be.a('function').and.to.have.a.property('length', 1);
    expect(wipe('how')).to.equal(true);
    expect(wipe(17)).to.equal(true);
    expect(wipe(null)).to.equal(false);
    expect(wipe('good try')).to.equal(false);
    expect(wipe([])).to.equal(false);
  });

  it('Should resolve unsupported values and types with the skip', () => {
    expect(Wipe.resolve(undefined)).to.equal(Wipe.skip);
    expect(Wipe.resolve(null)).to.equal(Wipe.skip);
    expect(Wipe.resolve(NaN)).to.equal(Wipe.skip);
    expect(Wipe.resolve(17)).to.equal(Wipe.skip);
    expect(Wipe.resolve('')).to.equal(Wipe.skip);
    expect(Wipe.resolve('unsupported string')).to.equal(Wipe.skip);
    expect(Wipe.resolve({ how: 'about no' })).to.equal(Wipe.skip);
    expect(Wipe.resolve(new Date())).to.equal(Wipe.skip);
  });

  describe('options/Wipe.falsy', () => {
    it('Should work in relaxed mode', () => {
      expect(Wipe.falsy.relaxed(undefined)).to.equal(true);
      expect(Wipe.falsy.relaxed(null)).to.equal(true);
      expect(Wipe.falsy.relaxed(NaN)).to.equal(true);
      expect(Wipe.falsy.relaxed(false)).to.equal(false);
      expect(Wipe.falsy.relaxed(0)).to.equal(false);
      expect(Wipe.falsy.relaxed(7)).to.equal(false);
      expect(Wipe.falsy.relaxed('')).to.equal(true);
      expect(Wipe.falsy.relaxed('bar')).to.equal(false);
      expect(Wipe.falsy.relaxed([])).to.equal(false);
      expect(Wipe.falsy.relaxed({})).to.equal(false);
      expect(Wipe.falsy.relaxed(() => {})).to.equal(false);
      expect(Wipe.falsy.relaxed(new Set())).to.equal(false);
      expect(Wipe.falsy.relaxed(new Map())).to.equal(false);
      expect(Wipe.falsy.relaxed(new Date())).to.equal(false);
      expect(Wipe.falsy.relaxed(new RegExp('test'))).to.equal(false);
    });

    it('Should work in strict mode', () => {
      expect(Wipe.falsy.strict(undefined)).to.equal(true);
      expect(Wipe.falsy.strict(null)).to.equal(true);
      expect(Wipe.falsy.strict(NaN)).to.equal(true);
      expect(Wipe.falsy.strict(false)).to.equal(true);
      expect(Wipe.falsy.strict(0)).to.equal(true);
      expect(Wipe.falsy.strict(7)).to.equal(false);
      expect(Wipe.falsy.strict('')).to.equal(true);
      expect(Wipe.falsy.strict('bar')).to.equal(false);
      expect(Wipe.falsy.strict([])).to.equal(false);
      expect(Wipe.falsy.strict({})).to.equal(false);
      expect(Wipe.falsy.strict(() => {})).to.equal(false);
      expect(Wipe.falsy.strict(new Set())).to.equal(false);
      expect(Wipe.falsy.strict(new Map())).to.equal(false);
      expect(Wipe.falsy.strict(new Date())).to.equal(false);
      expect(Wipe.falsy.strict(new RegExp('test'))).to.equal(false);
    });
  });

  describe('options/Wipe.empty', () => {
    it('Should work in loose mode', () => {
      expect(Wipe.empty.loose(undefined)).to.equal(true);
      expect(Wipe.empty.loose(null)).to.equal(true);
      expect(Wipe.empty.loose(NaN)).to.equal(true);
      expect(Wipe.empty.loose(false)).to.equal(false);
      expect(Wipe.empty.loose(0)).to.equal(false);
      expect(Wipe.empty.loose(7)).to.equal(false);
      expect(Wipe.empty.loose('')).to.equal(true);
      expect(Wipe.empty.loose('bar')).to.equal(false);
      expect(Wipe.empty.loose([])).to.equal(true);
      expect(Wipe.empty.loose([0])).to.equal(false);
      expect(Wipe.empty.loose({})).to.equal(true);
      expect(Wipe.empty.loose({ k: 'v' })).to.equal(false);
      expect(Wipe.empty.loose(nonEnumerableObject)).to.equal(false);
      expect(Wipe.empty.loose(symbolObject)).to.equal(false);
      expect(Wipe.empty.loose(() => {})).to.equal(false);
      expect(Wipe.empty.loose(new Set())).to.equal(true);
      expect(Wipe.empty.loose(new Map())).to.equal(true);
      expect(Wipe.empty.loose(new Date())).to.equal(true);
      expect(Wipe.empty.loose(new RegExp('test'))).to.equal(false);
    });

    it('Should work in relaxed mode', () => {
      expect(Wipe.empty.relaxed(undefined)).to.equal(true);
      expect(Wipe.empty.relaxed(null)).to.equal(true);
      expect(Wipe.empty.relaxed(NaN)).to.equal(true);
      expect(Wipe.empty.relaxed(false)).to.equal(false);
      expect(Wipe.empty.relaxed(0)).to.equal(false);
      expect(Wipe.empty.relaxed(7)).to.equal(false);
      expect(Wipe.empty.relaxed('')).to.equal(true);
      expect(Wipe.empty.relaxed('bar')).to.equal(false);
      expect(Wipe.empty.relaxed([])).to.equal(true);
      expect(Wipe.empty.relaxed([0])).to.equal(false);
      expect(Wipe.empty.relaxed({})).to.equal(true);
      expect(Wipe.empty.relaxed({ k: 'v' })).to.equal(false);
      expect(Wipe.empty.relaxed(nonEnumerableObject)).to.equal(true);
      expect(Wipe.empty.relaxed(symbolObject)).to.equal(true);
      expect(Wipe.empty.relaxed(() => {})).to.equal(false);
      expect(Wipe.empty.relaxed(new Set())).to.equal(true);
      expect(Wipe.empty.relaxed(new Map())).to.equal(true);
      expect(Wipe.empty.relaxed(new Date())).to.equal(true);
      expect(Wipe.empty.relaxed(new RegExp('test'))).to.equal(true);
    });

    it('Should work in strict mode', () => {
      expect(Wipe.empty.strict(undefined)).to.equal(true);
      expect(Wipe.empty.strict(null)).to.equal(true);
      expect(Wipe.empty.strict(NaN)).to.equal(true);
      expect(Wipe.empty.strict(false)).to.equal(true);
      expect(Wipe.empty.strict(0)).to.equal(true);
      expect(Wipe.empty.strict(7)).to.equal(false);
      expect(Wipe.empty.strict('')).to.equal(true);
      expect(Wipe.empty.strict('bar')).to.equal(false);
      expect(Wipe.empty.strict([])).to.equal(true);
      expect(Wipe.empty.strict([0])).to.equal(false);
      expect(Wipe.empty.strict({})).to.equal(true);
      expect(Wipe.empty.strict({ k: 'v' })).to.equal(false);
      expect(Wipe.empty.strict(nonEnumerableObject)).to.equal(true);
      expect(Wipe.empty.strict(symbolObject)).to.equal(true);
      expect(Wipe.empty.strict(() => {})).to.equal(false);
      expect(Wipe.empty.strict(new Set())).to.equal(true);
      expect(Wipe.empty.strict(new Map())).to.equal(true);
      expect(Wipe.empty.strict(new Date())).to.equal(true);
      expect(Wipe.empty.strict(new RegExp('test'))).to.equal(true);
    });
  });
});
