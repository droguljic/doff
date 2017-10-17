## doff

[![Build Status](https://travis-ci.org/droguljic/doff.svg?branch=master)](https://travis-ci.org/droguljic/doff)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/d097053c5033422ea90a0f44829dbfd8)](https://www.codacy.com/app/droguljic/doff?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=droguljic/doff&amp;utm_campaign=Badge_Grade)
[![Codacy Badge](https://api.codacy.com/project/badge/Coverage/d097053c5033422ea90a0f44829dbfd8)](https://www.codacy.com/app/droguljic/doff?utm_source=github.com&utm_medium=referral&utm_content=droguljic/doff&utm_campaign=Badge_Coverage)
[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)

A powerful tool to free your objects / arrays from the unwanted content

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

you can also create a custom instance by providing the options

```
// Options for the new instance are result of merge between provided and default options
const instance = doff.create({ mutate: true, symbols: true });
```

if needed, you can overwrite the options of the default instance

```
// Only provided keys are overwritten
doff.use({ symbols: true, falltrough: true, blur: { paths: 'top.secret.path' } });
```

### Notice

Overwriting the options of the default instance won't affect an instances created before, but it will affect
an instances created later on, if options are not isolated.

##  Usage

Working with the instance options

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

Working with the provided options

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

doff(target, { mutate: true, depth: 2 });

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

Working with the isolated options

```
const target = {
  start: undefined,
  with: true,
  empty: {},
  or: '',
  simple: { [Symbol('key')]: 17 },
  pattern: /[0-9]/
};

// Using instance with the isolated options
const instance = doff.create({ isolate: true });
let output = instance(target);

// Is equivalent of providing the isolated options
output = doff(target, { isolate: true });

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
  simple: { [Symbol('key')]: 17 },
  pattern: /[0-9]/
}
 */
```

and not providing the `wipe` and `blur` keys, will output an accumulator which is a clone of the target. However, not
all values will be cloned, just ones with type `object` that have enumerable keys, `symbol` keys are dependent on
`symbols` option.<br>
Providing isolated options to the `doff.use` is the same as providing non-isolated options.

## Options

The list of available options for creating the instances or doffing.

- `isolate` - flag denoting how provided options will be used, when `true` options are used as is, otherwise
merged with the options of the default instance
- `mutate` - flag denoting what to do with the provided target, when `true` target is mutated, otherwise
new one, with the same prototype, is constructed
- `depth` - define how deep to go, accepts
  - `number 0` - go all the way
  - `number > 0` - go up to the provided depth
  - `number < 0` - start from the provided depth
- `symbols` - flag denoting which keys to take into consideration, when `true` symbol keys are also taken
into consideration, otherwise they are ignored
- `fallthrough` - flag denoting what to do with the kept entries, when `true` they will reach the `wipe`,
otherwise they won't
- `preserve` - preserve takes precedence over the `reference` and the `wipe`
  - `arrays` - flag denoting what to do with the arrays, when `true` array values will stay intact,
  otherwise they will be inspected
  - `objects` - flag denoting what to do with the objects, when `true` object values will stay intact,
  otherwise they will be inspected
  - `paths` - the paths to keep, accepts
    * `string` reflecting the single path to keep, e.g. `some.important[0].path`
    * `Array.<string>` reflecting the paths to keep, e.g. `[some.important[0].path, this.one.also]`
  - `types` - the types to keep, accepts
    * `string` reflecting the single type to keep, e.g. `[object Map]`
    * `function` reflecting the single type to keep, e.g. `Set`, evaluated using `instanceof`
    * `Array.<string|function>` the combination of previous two
- `reference` - object to take as a reference, i.e. if object has a path keep it, otherwise inspect,
takes precedence over the `wipe`
- `wipe` - values to wipe from the target, accepts
  - `string falsy.relaxed` - falsy values excluding, `false` and `0`
  - `string falsy.strict` - falsy values
  - `string empty.loose` - falsy values, excluding `0` and `false`, objects without own keys,
  arrays and likes with length of `0`, maps and sets with size of `0`
  - `string empty.relaxed`, alias `false` - falsy values, excluding `0` and `false`, objects without own
  `string` enumerable keys, arrays and likes with length of `0`, maps and sets with size of `0`
  - `string empty.strict`, alias `true` - falsy values, objects without own `string` enumerable keys,
  arrays and likes with length of `0`, maps and sets with size of `0`
  - `Array` - of values
  - `function` - with signature `(value, path, target)`, returning `true` for wiping and `false` otherwise
- `blur` - paths that are not wiped can be blurred, e.g. masked. Suitable for sensitive data, e.g. passwords
  - `paths` - to blur, i.e. replace with mask values, accepts
    * `string` - reflecting a single path to blur using value of the `mask` key
    * `object` - where key is a path to blur and value is a mask to use
    * `Array.<string|object>` - the combination of previous two
    * `function` - with signature `(value, path, target)`, returning a mask to use
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

Parameter `path` passed to the callback is a object containing `asString`
and `asArray` properties. Take for a example following target,

```
  const target = {
    start: [{
      [Symbol('of')]: 'something'
    }]
  };
```

`path` passed to the function in a case of `'a something'` value, would look like
```
{
  asString: 'start[0].@@of'
  asArray: ['start', 0, Symbol('of')]
}
```


## API

### `doff(target[, options])`

Doff the unwanted entries and return the result.

### `doff.use(options)`

<b>Available only on the default instance!</b><br>
Overwrite the options of the default instance with provided ones and return the default instance.

### `doff.create(options)`

<b>Available only on the default instance!</b><br>
Create the new instance using a provided options.

### `doff.getOptions()`

Return the options of a target instance.

### `doff.aim(target[, options])`

Alias for the `doff`.
