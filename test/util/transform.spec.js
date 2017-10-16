// Load modules

const expect = require('chai').expect;
const rewire = require('rewire');
const spy = require('sinon').spy;
const type = require('type-detect');

const isExplicitObject = require('../../lib/util/isExplicitObject');
const isType = require('../../lib/util/isType');
const transform = rewire('../../lib/util/transform');

// Internal logic

const STATE_KEYS = ['path', 'object', 'preserved'];

const array = [
  56733217,
  'Element',
  false,
  0,
  /(test_this){1,}/,
  {
    first: 'Property',
    blue: 53579967,
    unknown: undefined
  },
  [1970, 1, 1, 0, 0, 0],
  {
    empty: '',
    same: []
  }
];

const object = {
  some: 'Some value',
  other: 158947,
  bool: true,
  bar: {
    prop: 'What is this?',
    arry: [35467, true, 'self'],
    numb: -1
  },
  more: {
    nest: {
      me: {
        now: Date.now()
      },
      you: /(you)+/
    },
    nice: [],
    add: 17
  }
};

function Footprint() {
  this.hello = 'World';
  this.foo = 'Bar';
  this.why = 41;
  this.blank = [];
  this.time = new Date();
  this.go = {
    deep: {
      even: {
        deeper: {
          than: {
            you: {
              can: {
                imagine: {
                  it: undefined
                }
              }
            }
          }
        }
      }
    }
  };
}

Footprint.prototype.great = function() {
  return 'Success';
};

const instance = new Footprint();

// Describe test cases

describe('util/transform', () => {
  it('Should pass correct parameters into the iteratee in case of an array target', () => {
    transform(array, (acc, val, idx, arr) => {
      expect(acc).to.be.an('array');
      expect(arr).to.equal(array);
      expect(arr).to.have.own.property(idx, val);
    });
  });

  it('Should call the iteratee for each element of an array target', () => {
    const indexes = [];
    transform(array, (acc, val, idx) => indexes.push(idx));
    expect(array).to.have.all.keys(indexes);
  });

  it('Should pass correct parameters into the iteratee in case of an object target', () => {
    transform(object, (acc, val, key, obj) => {
      expect(acc).to.be.an('object');
      expect(obj).to.equal(object);
      expect(obj).to.have.own.property(key, val);
    });

    transform(instance, (acc, val, key, obj) => {
      expect(acc).to.be.an(type(instance));
      expect(obj).to.equal(instance);
      expect(obj).to.have.own.property(key, val);
    });
  });

  it('Should call the iteratee for every own property of an object target', () => {
    let keys = [];
    transform(object, (acc, val, key) => keys.push(key));
    expect(object).to.have.all.keys(keys);

    keys = [];
    transform(instance, (acc, val, key) => keys.push(key));
    expect(instance).to.have.all.keys(keys);
  });

  it('Should use a proper accumulator when the target is not mutated', () => {
    const aAcummulator = transform(array, () => {});
    expect(aAcummulator).to.not.equal(array);
    expect(Object.getPrototypeOf(aAcummulator)).to.equal(Object.getPrototypeOf(array));

    const oAcummulator = transform(object, () => {});
    expect(oAcummulator).to.not.equal(object);
    expect(Object.getPrototypeOf(oAcummulator)).to.equal(Object.getPrototypeOf(object));

    const iAcummulator = transform(instance, () => {});
    expect(iAcummulator).to.not.equal(instance);
    expect(Object.getPrototypeOf(iAcummulator)).to.equal(Object.getPrototypeOf(instance));

    const pAccumulator = transform(Object.create({ constructor: null }), () => {});
    expect(pAccumulator).to.be.an('object');
    expect(pAccumulator.constructor).to.equal(Object);
  });

  it('Should return the target when mutate option is true', () => {
    const aAcummulator = transform(array, () => {}, { mutate: true });
    expect(aAcummulator).to.equal(array);

    const oAcummulator = transform(object, () => {}, { mutate: true });
    expect(oAcummulator).to.equal(object);

    const iAcummulator = transform(instance, () => {}, { mutate: true });
    expect(iAcummulator).to.equal(instance);
  });

  it('Should pass the target as an accumulator to the iteratee when mutate option is true', () => {
    transform(array, (acc) => expect(acc).to.equal(array), { mutate: true });
    transform(object, (acc) => expect(acc).to.equal(object), { mutate: true });
    transform(instance, (acc) => expect(acc).to.equal(instance), { mutate: true });
  });

  it('Should traverse the target array in reverse order when mutate option is true', () => {
    const indexes = [];
    transform(array, (acc, val, idx) => indexes.push(idx), { mutate: true });
    expect(indexes).to.deep.equal([7, 6, 5, 4, 3, 2, 1, 0]);
  });

  it('Should include symbol properties when symbols option is true', () => {
    const symbolProperty = Symbol('property');
    const options = { symbols: true };
    const accumulator = transform(
      { [symbolProperty]: 'Super Cool' },
      (acc, val, key) => (acc[key] = val),
      options
    );
    expect(accumulator).to.have.own.property(symbolProperty, 'Super Cool');
  });

  describe('util/transform.deep', () => {
    it('Should pass correct parameters into the iteratee in case of an array target', () => {
      transform.deep(array, (acc, val, key, fgm, sta) => {
        expect(acc).to.be.a(type(fgm));
        expect(sta).to.be.an('object').and.to.have.all.keys(STATE_KEYS);
        expect(sta.object).to.equal(array);
        expect(sta.path).to.be.a('localpath');
        expect(sta.preserved).to.be.a('boolean');
        expect(fgm).to.have.own.property(key);
        expect(sta.object).to.have.nested.property(sta.path.asString, fgm[key]);
        // Accumulator is not populated so we can only assert type with certainty
        expect(val).to.be.a(type(fgm[key]));
      });
    });

    it('Should call the iteratee for each element of an array target recursively', () => {
      const paths = [];
      transform.deep(array, (acc, val, idx, fgm, { path: pth }) => paths.push(pth));
      expect(paths.map((p) => p.asString)).to.deep.equal([
        '[0]',
        '[1]',
        '[2]',
        '[3]',
        '[4]',
        '[5].first', '[5].blue', '[5].unknown', '[5]',
        '[6][0]', '[6][1]', '[6][2]', '[6][3]', '[6][4]', '[6][5]', '[6]',
        '[7].empty', '[7].same', '[7]'
      ]);
    });

    it('Should pass correct parameters into the iteratee in case of an object target', () => {
      transform.deep(object, (acc, val, key, fgm, sta) => {
        expect(acc).to.be.a(type(fgm));
        expect(sta).to.be.an('object').and.to.have.all.keys(STATE_KEYS);
        expect(sta.object).to.equal(object);
        expect(sta.path).to.be.a('localpath');
        expect(sta.preserved).to.be.a('boolean');
        expect(fgm).to.have.own.property(key);
        expect(sta.object).to.have.nested.property(sta.path.asString, fgm[key]);
        // Accumulator is not populated so we can only assert type with certainty
        expect(val).to.be.a(type(fgm[key]));
      });

      transform.deep(instance, (acc, val, key, fgm, sta) => {
        expect(acc).to.be.an(type(fgm));
        expect(sta).to.be.an('object').and.to.have.all.keys(STATE_KEYS);
        expect(sta.object).to.equal(instance);
        expect(sta.path).to.be.an('localpath');
        expect(sta.preserved).to.be.an('boolean');
        expect(fgm).to.have.own.property(key);
        expect(sta.object).to.have.nested.property(sta.path.asString, fgm[key]);
        // Accumulator is not populated so we can only assert type with certainty
        expect(val).to.be.an(type(fgm[key]));
      });
    });

    it('Should call the iteratee for every own property of an object taget recursively', () => {
      let paths = [];
      transform.deep(object, (acc, val, idx, fgm, { path: pth }) => paths.push(pth));
      expect(paths.map((p) => p.asString)).to.deep.equal([
        'some',
        'other',
        'bool',
        'bar.prop', 'bar.arry[0]', 'bar.arry[1]', 'bar.arry[2]', 'bar.arry', 'bar.numb', 'bar',
        'more.nest.me.now', 'more.nest.me', 'more.nest.you', 'more.nest', 'more.nice', 'more.add', 'more'
      ]);

      paths = [];
      transform.deep(instance, (acc, val, idx, fgm, { path: pth }) => paths.push(pth));
      expect(paths.map((p) => p.asString)).to.deep.equal([
        'hello',
        'foo',
        'why',
        'blank',
        'time',
        'go.deep.even.deeper.than.you.can.imagine.it', 'go.deep.even.deeper.than.you.can.imagine',
        'go.deep.even.deeper.than.you.can', 'go.deep.even.deeper.than.you', 'go.deep.even.deeper.than',
        'go.deep.even.deeper', 'go.deep.even', 'go.deep', 'go'
      ]);
    });

    it('Should create the appropriate state object', () => {
      const deep = spy();
      transform.__with__({ deep })(() => {
        const options = { symbols: true, depth: -1, preserve: undefined };
        transform.deep({}, () => {}, options);
        const state = deep.args[0][3];
        expect(state).to.have.deep.own.property('object', {});
        expect(state).to.not.have.own.property('mutate');
        expect(state).to.have.own.property('symbols', options.symbols);
        expect(state).to.have.own.property('level', 1);
        expect(state).to.have.own.property('depth', options.depth);
        expect(state).to.have.own.property('preserve', transform.__get__('preserve'));
        expect(state).to.have.own.property('hasDepth', transform.__get__('hasDepth'));
        deep.reset();
      });
    });

    it('Should respect the depth option when provided', () => {
      let paths = [];
      transform.deep(array, (acc, val, key, fgm, { path: pth }) => paths.push(pth), { depth: 1 });
      expect(paths.map((p) => p.asString)).to.deep.equal(['[0]', '[1]', '[2]', '[3]', '[4]', '[5]', '[6]', '[7]']);

      paths = [];
      transform.deep(array, (acc, val, key, fgm, { path: pth }) => paths.push(pth), { depth: -1 });
      expect(paths.map((p) => p.asString)).to.deep.equal([
        '[5].first', '[5].blue', '[5].unknown',
        '[6][0]', '[6][1]', '[6][2]', '[6][3]', '[6][4]', '[6][5]',
        '[7].empty', '[7].same'
      ]);

      paths = [];
      transform.deep(object, (acc, val, key, fgm, { path: pth }) => paths.push(pth), { depth: 2 });
      expect(paths.map((p) => p.asString)).to.deep.equal([
        'some',
        'other',
        'bool',
        'bar.prop', 'bar.arry', 'bar.numb', 'bar',
        'more.nest', 'more.nice', 'more.add', 'more'
      ]);

      paths = [];
      transform.deep(object, (acc, val, key, fgm, { path: pth }) => paths.push(pth), { depth: -2 });
      expect(paths.map((p) => p.asString)).to.deep.equal([
        'bar.arry[0]', 'bar.arry[1]', 'bar.arry[2]', 'more.nest.me.now', 'more.nest.me', 'more.nest.you'
      ]);

      paths = [];
      transform.deep(instance, (acc, val, key, fgm, { path: pth }) => paths.push(pth), { depth: 7 });
      expect(paths.map((p) => p.asString)).to.deep.equal([
        'hello',
        'foo',
        'why',
        'blank',
        'time',
        'go.deep.even.deeper.than.you.can', 'go.deep.even.deeper.than.you', 'go.deep.even.deeper.than',
        'go.deep.even.deeper', 'go.deep.even', 'go.deep', 'go'
      ]);

      paths = [];
      transform.deep(instance, (acc, val, key, fgm, { path: pth }) => paths.push(pth), { depth: -7 });
      expect(paths.map((p) => p.asString)).to.deep.equal([
        'go.deep.even.deeper.than.you.can.imagine.it', 'go.deep.even.deeper.than.you.can.imagine'
      ]);
    });

    it('Should use the preserve option when provided', () => {
      let options = { preserve: (value) => Array.isArray(value) };
      let paths = [];
      transform.deep(array, (acc, val, key, fgm, { path: pth, preserve: prs }) => paths.push(pth), options);
      expect(paths.map((p) => p.asString)).to.deep.equal([
        '[0]', '[1]', '[2]', '[3]', '[4]',
        '[5].first', '[5].blue', '[5].unknown', '[5]', '[6]', '[7].empty', '[7].same', '[7]'
      ]);

      options = { preserve: (value) => isExplicitObject(value) };
      paths = [];
      transform.deep(object, (acc, val, key, fgm, { path: pth, preserve: prs }) => paths.push(pth), options);
      expect(paths.map((p) => p.asString)).to.deep.equal(['some', 'other', 'bool', 'bar', 'more']);

      options = { preserve: (value, { asString: path }) => ['go'].includes(path) };
      paths = [];
      transform.deep(instance, (acc, val, key, fgm, { path: pth }) => paths.push(pth), options);
      expect(paths.map((p) => p.asString)).to.deep.equal(['hello', 'foo', 'why', 'blank', 'time', 'go']);

      options = { preserve: (value) => isType(value, Footprint) };
      paths = [];
      transform.deep({ instance }, (acc, val, key, fgm, { path: pth }) => paths.push(pth), options);
      expect(paths.map((p) => p.asString)).to.deep.equal(['instance']);
    });

    it('Should denote preserved values', () => {
      let options = { preserve: (value) => Array.isArray(value) };
      transform.deep(array, (acc, val, key, fgm, { preserved: prs }) => {
        expect(prs).to.equal(type(val) === 'Array');
      }, options);

      options = { preserve: (value) => isExplicitObject(value) };
      transform.deep(object, (acc, val, key, fgm, { preserved: prs }) => {
        expect(prs).to.equal(type(val) === 'Object');
      }, options);

      options = { preserve: (value, { asString: path }) => ['go'].includes(path) };
      transform.deep(instance, (acc, val, key, fgm, { path: pth, preserved: prs }) => {
        expect(prs).to.equal(pth.asString === 'go');
      }, options);

      const example = { instance, something: 'other' };
      options = { preserve: (value) => isType(value, Footprint) };
      transform.deep(example, (acc, val, key, fgm, { preserved: prs }) => {
        expect(prs).to.equal(isType(val, Footprint));
      }, options);
    });

    it('Should use the hasDepth option when provided', () => {
      const options = { hasDepth: () => false };
      const paths = [];
      transform.deep(array, (acc, val, key, fgm, { path: pth }) => paths.push(pth), options);
      expect(paths.map((p) => p.asString)).to.deep.equal(['[0]', '[1]', '[2]', '[3]', '[4]', '[5]', '[6]', '[7]']);
    });
  });
});
