# doff

A powerful tool to free your objects / arrays from the unwanted content

# Installing

```
npm install --save doff
```

# Example

```
const doff = require('doff');

const target = {
  some: 'value',
  state: false,
  big: 0,
  nest: {
    nothing: null
  },
  sequence: [17, 'is', '', undefined, {}]
  unique: new Set(),
  pattern: /[how]_[does]_[this]_[work]/
};

const output = doff(target);

console.log(output);

// => {
//    some: 'value',
//    state: false,
//    big: 0,
//    sequence: [17, 'is'],
//    pattern: /[how]_[does]_[this]_[work]/
//  }
```

# Usage

There are several ways to use the `doff`

## Default

Most straightforward way is to use the default instance

```
const doff = require('doff');
```

## Create an instance

You can also create an instance with the custom options and reuse it across the application

```
const doff = require('doff');
const instance = doff.create({ mutate: true, symbols: true });
```

## Overwrite the default

If needed, you can overwrite the options of the default instance

```
const doff = require('doff');
doff.use({ depth: 2, falltrough: true });
```

### Notice

Overwriting the options of the default instance won't affect previously created instances, but it will affect
an instances created later on, if options are not isolated.

# Options

This is the list of available options for creating the instances or doffing.

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

## Path

Parameter `path` passed to the `wipe` and `blur.paths` options in a case of a function is a object with the `asString`
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

## Defaults

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

# API

### `doff(target[, options])`

Doff the unwanted entries and return the result.

### `doff.use(options)`

<b>Available only on the default instance!</b><br>
Overwrite options of the default instance with provided ones and return the default instance.

### `doff.create(options)`

<b>Available only on the default instance!</b><br>
Create the new instance with provided options.

### `doff.getOptions()`

Return the options of target instance.

### `doff.aim(target[, options])`

Alias for the `doff`.
