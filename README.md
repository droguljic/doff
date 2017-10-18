## doff

[![npm version](https://img.shields.io/npm/v/doff.svg?style=flat-square)](https://www.npmjs.org/package/doff)
[![build status](https://img.shields.io/travis/droguljic/doff.svg?style=flat-square)](https://travis-ci.org/droguljic/doff)
[![code quality](https://img.shields.io/codacy/grade/d097053c5033422ea90a0f44829dbfd8.svg?style=flat-square&label=codacy)](https://www.codacy.com/app/droguljic/doff?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=droguljic/doff&amp;utm_campaign=Badge_Grade)
[![code coverage](https://img.shields.io/codacy/coverage/d097053c5033422ea90a0f44829dbfd8.svg?style=flat-square)](https://www.codacy.com/app/droguljic/doff?utm_source=github.com&utm_medium=referral&utm_content=droguljic/doff&utm_campaign=Badge_Coverage)
[![dependencies](https://img.shields.io/david/droguljic/doff.svg?style=flat-square)](https://github.com/droguljic/doff)
[![development dependencies](https://img.shields.io/david/dev/droguljic/doff.svg?style=flat-square)](https://github.com/droguljic/doff)

A powerful tool to free your objects and arrays from unwanted content

## Instalation

```
npm install --save doff
```

## Features
- wipe, i.e. remove, unwanted content
- blur, i.e. mask, sensitive content
- mutate or accumulate a target
- choose start or end depth
- symbol keys support
- no external dependencies

## Instances

Alongside the default instance

```
const doff = require('doff');
```

you can also create a new instance with custom options

```
// Options for a new instance are result of merge between provided and default options
const instance = doff.create({
  mutate: true,
  symbols: true
});
```

if needed, you can overwrite options of the default instance

```
// Only provided keys are overwritten
doff.use({
  symbols: true,
  falltrough: true,
  blur: {
    paths: 'top.secret.path'
  }
});
```

### Notice

Overwriting options of the default instance won't affect instances created before, but it will affect
instances created later on, if options are not isolated.

##  Usage

Working with instance options

```
const target = {
  some: 'value',
  state: false,
  big: 0,
  nest: {
    nothing: null
  },
  sequence: [17, 'is', '', undefined, {}],
  unique: new Set(),
  pattern: /[how]_[does]_[this]_[work]/
};

const output = doff(target);

console.log(target === output);
// => false
console.log(output);
/* =>
{
  some: 'value',
  state: false,
  big: 0,
  sequence: [17, 'is'],
  pattern: /[how]_[does]_[this]_[work]/
}
 */
```

Working with custom options

```
const target = [
  'bold statement',
  NaN,
  true,
  {
    now: {
      lets: {
        nest: {
          things: undefined
        }
      }
    }
  },
  null,
  new Set(),
  ['', {}, [null]]
];

doff(target, {
  mutate: true,
  depth: 2
});

console.log(target);
/* =>
[
  'bold statement',
  true,
  {
    now: {
      lets: {
        nest: {
          things: undefined
        }
      }
    }
  },
  [[null]]
]
 */
```

Working with isolated options

```
const target = {
  start: undefined,
  with: true,
  empty: {},
  or: '',
  simple: {
    [Symbol('key')]: 17
  },
  pattern: /[0-9]/
};

// Using a instance with isolated options
const instance = doff.create({
  isolate: true
});
let output = instance(target);

// Is equivalent of providing isolated options
output = doff(target, {
  isolate: true
});

console.log(target === output);
// => false
console.log(target.empty === output.empty);
// => true
console.log(target.simple === output.simple);
// => true
console.log(output);
/* =>
{
  start: undefined,
  with: true,
  empty: {},
  or: '',
  simple: {
    [Symbol('key')]: 17
  },
  pattern: /[1-9]/
}
 */
```

and not providing `wipe` and `blur` keys, will output an accumulator which is a clone of a target. However, not
all values will be cloned, just ones with a type `object` that have enumerable keys, `symbol` keys are dependent on a
`symbols` option.<br>
Providing isolated options to the `doff.use` is the same as providing non-isolated options.

## Options

The list of available options for doffing

- `isolate` - determines how provided options are used, when `true` options are used as is, otherwise
merged with options of the default instance
- `mutate` - determines what to do with a provided target, when `true` a target is mutated, otherwise a
new one, with a same prototype, is constructed
- `depth` - defines how deep to go, accepts
  - `number 0` - go all the way
  - `number > 0` - go up to the defined depth
  - `number < 0` - start from the defined depth
- `symbols` - determines which keys are taken into consideration, when `true` symbol keys are also taken
into consideration, otherwise they are ignored
- `fallthrough` - determines what to do with kept entries, when `true` they will reach the `wipe`,
otherwise they won't
- `preserve` - takes precedence over the `reference` and the `wipe`
  - `arrays` - determines what to do with arrays, when `true` array values will stay intact,
  otherwise they will be inspected
  - `objects` - determines what to do with objects, when `true` object values will stay intact,
  otherwise they will be inspected
  - `paths` - defines paths to keep, accepts
    * `string` - a single path to keep, e.g. `some.important[0].path`
    * `Array.<string>` - a list of paths to keep, e.g. `[some.important[0].path, this.one.also]`
  - `types` - defines types to keep, accepts
    * `string` - a single type to keep, e.g. `[object Map]`
    * `function` - a single type to keep, e.g. `Set`, evaluated using `instanceof`
    * `Array.<string|function>` - a combination of previous two
- `reference` - an object to take as the reference, i.e. if an object has a path keep it, otherwise inspect,
takes precedence over the `wipe`
- `wipe` - values to wipe from a target, accepts
  - `string falsy.relaxed` - falsy values excluding, `false` and `0`
  - `string falsy.strict` - falsy values
  - `string empty.loose` - falsy values, excluding `0` and `false`, objects without own keys,
  arrays and likes with length of `0`, maps and sets with size of `0`
  - `string empty.relaxed`, alias `false` - falsy values, excluding `0` and `false`, objects without own
  `string` enumerable keys, arrays and likes with length of `0`, maps and sets with size of `0`
  - `string empty.strict`, alias `true` - falsy values, objects without own `string` enumerable keys,
  arrays and likes with length of `0`, maps and sets with size of `0`
  - `Array` - of values
  - `function` - with the signature `(value, path, target)`, returning `true` for wiping or `false` otherwise
- `blur` - paths that are not wiped can be blurred, e.g. masked. Suitable for a sensitive data, e.g. passwords
  - `paths` - to blur, i.e. replace with a mask value, accepts
    * `string` - a single path to blur using value of the `mask` key
    * `object` - where key is a path to blur and value is a mask to use
    * `Array.<string|object>` - a combination of previous two
    * `function` - with the signature `(value, path, target)`, returning a mask to use
  - `mask` - the default mask to use for blurring

### Defaults

Default values of available options, i.e. options of the default instance

```
{
  isolate: false,
  mutate: false,
  depth: 0,
  symbols: false,
  fallthrough: false,
  preserve: {
    arrays: false,
    objects: false,
    paths: undefined,
    types: ['[object Date]', '[object RegExp]']
  },
  reference: undefined,
  wipe: false,
  blur: {
    paths: undefined,
    mask: '*******'
  }
}
```

## Callback

As mentioned above callback provided as `wipe` and / or `blur.paths` options should look like

```
/**
 * @param {Object} value - the value to inspect
 * @param {Object} path - the path of the value inside the target
 * @param {Object} target - the provided target
 */
function (value, path, target) {
  // Hm, what to do now?
}
```

### Path

Parameter `path` passed to a callback is an object containing `asString` and `asArray` properties.
Take for a example the following target,

```
  const target = {
    start: [{
      [Symbol('of')]: 'something'
    }]
  };
```

`path` passed to a callback in a case of the `'something'` value, would look like
```
{
  asString: 'start[0].@@of'
  asArray: ['start', 0, Symbol('of')]
}
```


## API

### `doff(target[, options])`

Doff unwanted entries and return the result.

### `doff.use(options)`

<b>Available only on the default instance!</b><br>
Overwrite options of the default instance with provided ones and return the default instance.

### `doff.create(options)`

<b>Available only on the default instance!</b><br>
Create a new instance using provided options.

### `doff.getOptions()`

Return options of a target instance.

### `doff.aim(target[, options])`

Alias for the `doff`.

## License

This project is licensed under the terms of the MIT license.
