// Load modules

const expect = require('chai').expect;

const merge = require('../../lib/util/merge');

// Describe test cases

describe('util/merge', () => {
  it('Should return target', () => {
    const target = { how: 'this', will: 'turn', out: null };
    const output = merge(target, { how: 'that' });
    expect(target).to.equal(output);
  });

  it('Should work with null sources', () => {
    const target = { how: 'this', will: 'turn', out: null };
    merge(target, null, undefined);
    expect(target).to.deep.equal({ how: 'this', will: 'turn', out: null });
  });

  it('Should merge shallow sources with target', () => {
    const output = merge({
      some: 'key',
      yet: 'other',
      then: 41,
      more: true
    }, {
      some: 'notKey',
      is: 'super',
      but: 'how',
      who: undefined
    });

    expect(output).to.deep.equal({
      some: 'notKey',
      yet: 'other',
      then: 41,
      more: true,
      is: 'super',
      but: 'how',
      who: undefined
    });
  });

  it('Should merge deep sources with target', () => {
    const output = merge({
      now: 'let',
      see: { what: { will: { happen: '???' } } },
      regular: new Date('3417-09-21'),
      match: /how/,
      more: { nesting: 'Is Good', when: { you: 'Know When To Stop' }, on: 'time' },
      additional: Object.create(null),
      flat: [11]
    }, {
      now: 'let',
      see: {
        what: {
          will: { happen: '---' },
          after: 'this'
        }
      },
      regular: new Date('3500-01-01'),
      match: /simple/,
      more: {
        nesting: 'Is Good',
        when: { you: { know: 'How To Do It' } },
        properly: null
      },
      flat: [51, 39, 45]
    });

    expect(output).to.deep.equal({
      now: 'let',
      see: {
        what: {
          will: { happen: '---' },
          after: 'this'
        }
      },
      regular: new Date('3500-01-01'),
      match: /simple/,
      more: {
        nesting: 'Is Good',
        when: { you: { know: 'How To Do It' } },
        on: 'time',
        properly: null
      },
      additional: {},
      flat: [11, 51, 39, 45]
    });
  });

  describe('util/merge.with', () => {
    it('Should respect atomic keys', () => {
      const target = { how: 'this', will: 'turn', out: null, when: { nested: { key: { is: 'present' } } } };
      merge
        .with({ atomic: { keys: ['when'] } })
        .exec(target, { how: 'that', when: { we: { overwrite: 'it' } } });
      expect(target).to.deep.equal({ how: 'that', will: 'turn', out: null, when: { we: { overwrite: 'it' } } });
    });

    it('Should ignore non-values', () => {
      const target = { now: 'try', ultra: 'cool', thing: 'with', non: 'values' };
      merge
        .with({ ignore: { nonValues: true } })
        .exec(target, { ultra: 'super', thing: 'without', non: undefined, values: null });
      expect(target).to.deep.equal({ now: 'try', ultra: 'super', thing: 'without', non: 'values' });
    });
  });
});
